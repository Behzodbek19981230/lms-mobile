import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { studentMenuItems } from '../../navigation/menuDefinitions';
import { colors, radii } from '../../theme/colors';
import { getStudentDashboard, type StudentDashboardData } from '../../services/students';
import { showError } from '../../ui/toast';
import { MenuBarGrid } from '../common/MenuBarGrid';
import { t } from '../../i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'StudentHome'>;

export function StudentHomeScreen({ navigation }: Props) {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getStudentDashboard();
      setData(res);
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

  const stats = data?.stats;
  const cards = useMemo(
    () => [
      { label: 'Kurslarim', value: stats?.enrolledCourses ?? 0 },
      { label: 'Imtihonlar', value: `${stats?.completedExams ?? 0}/${stats?.totalExams ?? 0}` },
      { label: 'Testlar', value: `${stats?.completedTests ?? 0}/${stats?.totalTests ?? 0}` },
      { label: "O'rtacha ball", value: stats?.averageScore ?? 0 },
    ],
    [stats],
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
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>{data?.student?.fullName ? data.student.fullName : 'Talaba kabineti'}</Text>
      </View>

      <View style={styles.statsGrid}>
        {cards.map(c => (
          <View key={c.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{c.label}</Text>
            <Text style={styles.statValue}>{String(c.value)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Menyu</Text>
      <MenuBarGrid
        items={studentMenuItems}
        excludeScreens={['StudentHome']}
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
