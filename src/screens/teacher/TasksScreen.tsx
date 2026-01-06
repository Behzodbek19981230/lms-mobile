import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radii } from '../../theme/colors';
import { getGroupStudents, getMyGroups } from '../../services/groups';
import { getNotDoneStudentIds, submitBulkTasks } from '../../services/tasks';
import type { Group, GroupStudent } from '../../types/group';
import { toISODate } from '../../utils/date';
import { t } from '../../i18n';
import { formatWeekdays } from '../../utils/weekdays';
import { showError, showSuccess } from '../../ui/toast';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/AppStackParamList';

type Props = NativeStackScreenProps<AppStackParamList, 'Tasks'>;

export function TasksScreen({ route }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const [students, setStudents] = useState<GroupStudent[]>([]);
  const [notDoneIds, setNotDoneIds] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = useMemo(() => toISODate(new Date()), []);
  const date = route?.params?.date ?? today;

  const loadGroups = async () => {
    const data = await getMyGroups();
    setGroups(Array.isArray(data) ? data : []);
  };

  const loadForGroup = async (groupId: number) => {
    const [st, notDone] = await Promise.all([
      getGroupStudents(groupId),
      getNotDoneStudentIds(groupId, date).catch(() => []),
    ]);

    setStudents(Array.isArray(st) ? st : []);
    const ids = new Set<number>();
    (Array.isArray(notDone) ? notDone : []).forEach((id: any) => {
      const n = Number(id);
      if (!Number.isNaN(n)) ids.add(n);
    });
    setNotDoneIds(ids);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        await loadGroups();
      } catch (e: any) {
        if (!alive) return;
        setError(e?.response?.data?.message || "Guruhlarni yuklab bo'lmadi");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const initialGroupId = route?.params?.groupId;
    if (typeof initialGroupId === 'number' && initialGroupId > 0) {
      onSelectGroup(initialGroupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.groupId, route?.params?.date]);

  const onSelectGroup = async (groupId: number) => {
    setSelectedGroupId(groupId);
    setError('');
    setLoading(true);
    try {
      await loadForGroup(groupId);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Vazifa uchun ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotDone = (studentId: number) => {
    setNotDoneIds(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const onSave = async () => {
    if (!selectedGroupId) return;
    if (saving) return;

    setSaving(true);
    try {
      await submitBulkTasks({
        groupId: selectedGroupId,
        date,
        notDoneStudentIds: Array.from(notDoneIds),
      });

      showSuccess(t('common').savedTitle, t('tasks').savedMessage);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Vazifani saqlab bo'lmadi";
      showError(t('common').errorTitle, msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>{t('common').loading}</Text>
      </View>
    );
  }

  if (!selectedGroupId) {
    return (
      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.title}>{t('tasks').selectGroup}</Text>
        {groups.map(g => (
          <TouchableOpacity key={g.id} style={styles.card} onPress={() => onSelectGroup(g.id)}>
            <Text style={styles.cardTitle}>{g.name}</Text>
            <Text style={styles.muted}>
              {formatWeekdays(g.daysOfWeek)} • {g.startTime}-{g.endTime}
            </Text>
          </TouchableOpacity>
        ))}
        {groups.length === 0 ? <Text style={styles.muted}>{t('groups').empty}</Text> : null}
      </View>
    );
  }

  const groupName = groups.find(g => g.id === selectedGroupId)?.name || 'Guruh';
  const notDoneCount = students.filter(s => notDoneIds.has(s.id)).length;
  const doneCount = Math.max(0, students.length - notDoneCount);

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{groupName}</Text>
          <Text style={styles.muted}>
            {t('tasks').dateLabel}: {date}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setSelectedGroupId(null)} style={styles.linkBtn}>
          <Text style={styles.linkText}>{t('tasks').changeGroup}</Text>
        </TouchableOpacity>
      </View>

      {students.length > 0 ? (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>{t('tasks').statsTitle}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.accent }]}>{doneCount}</Text>
              <Text style={styles.statLabel}>{t('tasks').doneLabel}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.destructive }]}>{notDoneCount}</Text>
              <Text style={styles.statLabel}>{t('tasks').notDoneLabel}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <FlatList
        data={students}
        keyExtractor={s => String(s.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.muted}>{t('tasks').studentsEmpty}</Text>}
        renderItem={({ item }) => {
          const isNotDone = notDoneIds.has(item.id);
          return (
            <View style={styles.studentRow}>
              <View style={styles.flex1}>
                <Text style={styles.studentName}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.muted}>@{item.username}</Text>
              </View>
              <Switch
                value={isNotDone}
                onValueChange={() => toggleNotDone(item.id)}
                trackColor={{ false: colors.border, true: colors.destructive }}
                thumbColor={isNotDone ? colors.destructive : colors.primaryForeground}
              />
            </View>
          );
        }}
        ListFooterComponent={
          <TouchableOpacity
            onPress={onSave}
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? t('common').saving : t('common').save}</Text>
          </TouchableOpacity>
        }
        ListFooterComponentStyle={styles.listFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 8,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  error: {
    color: colors.destructive,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
    fontWeight: '700',
  },
  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 10,
  },
  flex1: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 2,
  },
  listContent: {
    paddingBottom: 24,
  },
  listFooter: {
    marginTop: 10,
    paddingBottom: 12,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: colors.primaryForeground,
    fontWeight: '800',
    fontSize: 14,
  },
});
