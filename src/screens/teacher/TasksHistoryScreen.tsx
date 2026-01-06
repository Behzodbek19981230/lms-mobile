import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radii } from '../../theme/colors';
import { getMyGroups } from '../../services/groups';
import { getTasksHistory } from '../../services/tasks';
import type { Group } from '../../types/group';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { t } from '../../i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'TasksHistory'>;

type HistoryItem = { date: string; notDoneCount: number };

export function TasksHistoryScreen({ navigation }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroups = async () => {
    const data = await getMyGroups();
    setGroups(Array.isArray(data) ? data : []);
  };

  const loadHistory = async (groupId: number) => {
    const res = await getTasksHistory(groupId, 60);
    setHistory(Array.isArray(res) ? res : []);
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

  const onSelectGroup = async (groupId: number) => {
    setSelectedGroupId(groupId);
    setLoading(true);
    setError('');
    try {
      await loadHistory(groupId);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Tarixni yuklab bo'lmadi");
      setHistory([]);
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>{t('tasks').historySelectGroup}</Text>
        {groups.map(g => (
          <TouchableOpacity key={g.id} style={styles.card} onPress={() => onSelectGroup(g.id)}>
            <Text style={styles.cardTitle}>{g.name}</Text>
            <Text style={styles.muted}>{t('tasks').historyHint}</Text>
          </TouchableOpacity>
        ))}
        {groups.length === 0 ? <Text style={styles.muted}>{t('groups').empty}</Text> : null}
      </View>
    );
  }

  const groupName = groups.find(g => g.id === selectedGroupId)?.name || 'Guruh';

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{t('tasks').historyTitle}</Text>
          <Text style={styles.muted}>{groupName}</Text>
        </View>
        <TouchableOpacity onPress={() => setSelectedGroupId(null)} style={styles.linkBtn}>
          <Text style={styles.linkText}>{t('tasks').changeGroup}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(it) => it.date}
        ListEmptyComponent={<Text style={styles.muted}>{t('tasks').historyEmpty}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyRow}
            onPress={() => navigation.navigate('Tasks', { groupId: selectedGroupId, date: item.date })}
          >
            <Text style={styles.cardTitle}>{item.date}</Text>
            <Text style={styles.muted}>{t('tasks').historyNotDone(item.notDoneCount)}</Text>
          </TouchableOpacity>
        )}
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
  linkBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  historyRow: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 10,
  },
});
