import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radii } from '../../theme/colors';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import type { Group } from '../../types/group';
import type { Subject } from '../../types/subject';
import type { UserLite } from '../../types/user';
import { t } from '../../i18n';
import { getMyGroups, updateGroup } from '../../services/groups';
import { getSubjects } from '../../services/subjects';
import { getUsersByRole } from '../../services/users';
import { showError, showSuccess } from '../../ui/toast';

const DAYS: Array<{ value: string; label: string }> = [
  { value: 'monday', label: 'Dushanba' },
  { value: 'tuesday', label: 'Seshanba' },
  { value: 'wednesday', label: 'Chorshanba' },
  { value: 'thursday', label: 'Payshanba' },
  { value: 'friday', label: 'Juma' },
  { value: 'saturday', label: 'Shanba' },
  { value: 'sunday', label: 'Yakshanba' },
];

type Props = NativeStackScreenProps<AppStackParamList, 'EditGroup'>;

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function EditGroupScreen({ route, navigation }: Props) {
  const { groupId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<UserLite[]>([]);
  const [students, setStudents] = useState<UserLite[]>([]);

  const [subjectOpen, setSubjectOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [studentIds, setStudentIds] = useState<number[]>([]);

  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [groups, subjectsRes, teachersRes, studentsRes] = await Promise.all([
          getMyGroups(),
          getSubjects(),
          getUsersByRole('teacher'),
          getUsersByRole('student'),
        ]);

        const group = (groups || []).find(g => g.id === groupId) as Group | undefined;
        if (!group) {
          setError(t('common').notFound);
          return;
        }

        setName(group.name || '');
        setDescription(group.description || '');
        setSubjectId(group.subjectId ?? null);
        setTeacherId(group.teacherId ?? null);
        setDaysOfWeek(Array.isArray(group.daysOfWeek) ? group.daysOfWeek : []);
        setStartTime(group.startTime || '09:00');
        setEndTime(group.endTime || '10:30');
        setStudentIds(Array.isArray(group.studentIds) ? group.studentIds : []);

        setSubjects(Array.isArray(subjectsRes) ? subjectsRes : []);
        setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
      } catch (e: any) {
        setError(e?.response?.data?.message || t('common').errorTitle);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  const selectedSubjectName = useMemo(() => {
    if (!subjectId) return '';
    return subjects.find(s => s.id === subjectId)?.name || '';
  }, [subjectId, subjects]);

  const selectedTeacherName = useMemo(() => {
    if (!teacherId) return '';
    const teacher = teachers.find(u => u.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
  }, [teacherId, teachers]);

  const filteredStudents = useMemo(() => {
    const term = studentSearch.trim().toLowerCase();
    if (!term) return students;
    return students.filter(s => {
      const full = `${s.firstName} ${s.lastName}`.toLowerCase();
      return (
        s.firstName.toLowerCase().includes(term) ||
        s.lastName.toLowerCase().includes(term) ||
        full.includes(term) ||
        (s.username || '').toLowerCase().includes(term)
      );
    });
  }, [studentSearch, students]);

  const canSave =
    !!name.trim() &&
    !!subjectId &&
    !!teacherId &&
    daysOfWeek.length > 0 &&
    isValidTime(startTime) &&
    isValidTime(endTime);

  const toggleDay = (value: string) => {
    setDaysOfWeek(prev =>
      prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value],
    );
  };

  const toggleStudent = (id: number) => {
    setStudentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const onSave = async () => {
    if (!canSave || !subjectId || !teacherId) return;
    setSaving(true);
    setError('');
    try {
      await updateGroup(groupId, {
        name: name.trim(),
        description: description.trim() ? description.trim() : undefined,
        subjectId,
        teacherId,
        studentIds,
        daysOfWeek,
        startTime,
        endTime,
      });
      showSuccess(t('common').savedTitle, t('groups').updatedMessage);
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || t('common').errorTitle;
      setError(msg);
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

  return (
    <FlatList
      style={styles.container}
      data={filteredStudents}
      keyExtractor={s => String(s.id)}
      ListHeaderComponent={
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('groups').editTitle}</Text>

            <Text style={styles.label}>{t('groups').nameLabel}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('groups').namePlaceholder}
              placeholderTextColor={colors.mutedForeground}
              style={styles.input}
            />

            <Text style={styles.label}>{t('groups').descriptionLabel}</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={t('groups').descriptionPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, styles.textarea]}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('groups').scheduleTitle}</Text>

            <Text style={styles.label}>{t('groups').daysLabel}</Text>
            <View style={styles.daysWrap}>
              {DAYS.map(d => {
                const selected = daysOfWeek.includes(d.value);
                return (
                  <Pressable
                    key={d.value}
                    onPress={() => toggleDay(d.value)}
                    style={[styles.pill, selected ? styles.pillSelected : styles.pillUnselected]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selected ? styles.pillTextSelected : styles.pillTextUnselected,
                      ]}
                    >
                      {d.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>{t('groups').startTimeLabel}</Text>
                <TextInput
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="09:00"
                  placeholderTextColor={colors.mutedForeground}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>{t('groups').endTimeLabel}</Text>
                <TextInput
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="10:30"
                  placeholderTextColor={colors.mutedForeground}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            {!isValidTime(startTime) || !isValidTime(endTime) ? (
              <Text style={styles.hint}>{t('groups').timeHint}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('groups').metaTitle}</Text>

            <Pressable
              style={styles.selectHeader}
              onPress={() => setSubjectOpen(v => !v)}
            >
              <Text style={styles.selectLabel}>{t('groups').subjectLabel}</Text>
              <Text style={styles.selectValue} numberOfLines={1}>
                {selectedSubjectName || t('groups').selectSubject}
              </Text>
            </Pressable>
            {subjectOpen ? (
              <View style={styles.selectList}>
                {subjects.map(s => {
                  const selected = s.id === subjectId;
                  return (
                    <Pressable
                      key={s.id}
                      onPress={() => {
                        setSubjectId(s.id);
                        setSubjectOpen(false);
                      }}
                      style={[styles.optionRow, selected ? styles.optionRowSelected : null]}
                    >
                      <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                        {s.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <Pressable
              style={styles.selectHeader}
              onPress={() => setTeacherOpen(v => !v)}
            >
              <Text style={styles.selectLabel}>{t('groups').teacherLabel}</Text>
              <Text style={styles.selectValue} numberOfLines={1}>
                {selectedTeacherName || t('groups').selectTeacher}
              </Text>
            </Pressable>
            {teacherOpen ? (
              <View style={styles.selectList}>
                {teachers.map(u => {
                  const selected = u.id === teacherId;
                  return (
                    <Pressable
                      key={u.id}
                      onPress={() => {
                        setTeacherId(u.id);
                        setTeacherOpen(false);
                      }}
                      style={[styles.optionRow, selected ? styles.optionRowSelected : null]}
                    >
                      <Text style={[styles.optionText, selected ? styles.optionTextSelected : null]}>
                        {u.firstName} {u.lastName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('groups').studentsTitle}</Text>
            <Text style={styles.muted}>{t('groups').studentsSelected(studentIds.length)}</Text>

            <TextInput
              value={studentSearch}
              onChangeText={setStudentSearch}
              placeholder={t('groups').searchStudentsPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              style={styles.input}
            />
          </View>
        </>
      }
      renderItem={({ item }) => {
        const selected = studentIds.includes(item.id);
        return (
          <Pressable
            onPress={() => toggleStudent(item.id)}
            style={[styles.studentRow, selected ? styles.studentRowSelected : null]}
          >
            <Text style={[styles.studentName, selected ? styles.studentNameSelected : null]}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={[styles.studentMark, selected ? styles.studentMarkSelected : null]}>
              {selected ? '✓' : ''}
            </Text>
          </Pressable>
        );
      }}
      ListEmptyComponent={<Text style={styles.muted}>{t('attendance').studentsEmpty}</Text>}
      ListFooterComponent={
        <Pressable
          onPress={onSave}
          disabled={!canSave || saving}
          style={[styles.saveBtn, !canSave || saving ? styles.saveBtnDisabled : null]}
        >
          <Text style={styles.saveBtnText}>
            {saving ? t('common').saving : t('common').save}
          </Text>
        </Pressable>
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  section: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.foreground,
    marginBottom: 12,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  error: {
    color: colors.destructive,
    marginBottom: 12,
  },
  hint: {
    color: colors.destructive,
    fontSize: 12,
  },
  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pillUnselected: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextUnselected: {
    color: colors.foreground,
  },
  pillTextSelected: {
    color: colors.primaryForeground,
  },
  selectHeader: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  selectValue: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  selectList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginBottom: 12,
    overflow: 'hidden',
  },
  optionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionRowSelected: {
    backgroundColor: colors.card,
  },
  optionText: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '800',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  studentRowSelected: {
    borderColor: colors.primary,
  },
  studentName: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: '700',
  },
  studentNameSelected: {
    color: colors.primary,
  },
  studentMark: {
    width: 18,
    textAlign: 'right',
    color: colors.mutedForeground,
    fontWeight: '900',
  },
  studentMarkSelected: {
    color: colors.primary,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.primaryForeground,
    fontWeight: '900',
  },
});
