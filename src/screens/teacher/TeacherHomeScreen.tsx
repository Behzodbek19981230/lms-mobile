import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from '../../i18n';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { teacherMenuItems } from '../../navigation/menuDefinitions';
import { colors, radii } from '../../theme/colors';
import { getMyGroups } from '../../services/groups';
import { getSubjects, getSubjectStats, type SubjectStats } from '../../services/subjects';
import { getTestStats, type TestStats } from '../../services/tests';
import { showError } from '../../ui/toast';
import { AuthContext } from '../../contexts/AuthContext';
import { MenuBarGrid } from '../common/MenuBarGrid';

type Props = NativeStackScreenProps<AppStackParamList, 'TeacherHome'>;

export function TeacherHomeScreen({ navigation }: Props) {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [subjectStats, setSubjectStatsState] = useState<SubjectStats | null>(null);
  const [testStats, setTestStatsState] = useState<TestStats | null>(null);

  const load = useCallback(async () => {
    try {
      const [subjects, groups, subStats, tStats] = await Promise.all([
        getSubjects(),
        getMyGroups(),
        getSubjectStats(),
        getTestStats(),
      ]);
      setSubjectsCount(Array.isArray(subjects) ? subjects.length : 0);
      setGroupsCount(Array.isArray(groups) ? groups.length : 0);
      setSubjectStatsState(subStats);
      setTestStatsState(tStats);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Ma'lumotlarni yuklab bo'lmadi";
      showError(t('common').errorTitle, msg);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const cards = useMemo(
    () => [
      { label: 'Fanlarim', value: subjectsCount },
      { label: 'Guruhlarim', value: groupsCount },
      { label: 'Testlar', value: testStats?.totalTests ?? 0 },
      { label: 'Savollar', value: testStats?.totalQuestions ?? 0 },
    ],
    [groupsCount, subjectsCount, testStats],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>{t('common').loading}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('teacher').homeTitle}</Text>
        <Text style={styles.subtitle}>
          {user?.fullName ? user.fullName : t('teacher').homeSubtitle}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {cards.map(c => (
          <View key={c.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{c.label}</Text>
            <Text style={styles.statValue}>{String(c.value)}</Text>
          </View>
        ))}
      </View>

      {subjectStats ? (
        <Text style={styles.mutedWide}>
          Aktiv fanlar: {subjectStats.activeSubjects ?? 0} • Center bo'yicha fanlar: {subjectStats.totalSubjects ?? 0}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Menyu</Text>
      <MenuBarGrid
        items={teacherMenuItems}
        excludeScreens={['TeacherHome']}
        onPressItem={item => navigation.navigate(item.screen as any)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '800',
    color: colors.foreground,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  mutedWide: {
    marginTop: 12,
    color: colors.mutedForeground,
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: 14,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 6,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.foreground,
  },
});
