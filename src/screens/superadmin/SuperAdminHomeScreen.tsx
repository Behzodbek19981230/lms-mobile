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
import { superAdminMenuItems } from '../../navigation/menuDefinitions';
import { t } from '../../i18n';
import { colors, radii } from '../../theme/colors';
import { getSuperAdminDashboardStats, type SuperAdminDashboardStats } from '../../services/admin';
import { showError } from '../../ui/toast';
import { MenuBarGrid } from '../common/MenuBarGrid';

type Props = NativeStackScreenProps<AppStackParamList, 'SuperAdminHome'>;

export function SuperAdminHomeScreen({ navigation }: Props) {
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getSuperAdminDashboardStats();
      setStats(data);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Statistikani yuklab bo\'lmadi';
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
      { label: 'Markazlar', value: stats?.totalCenters ?? 0 },
      { label: 'Foydalanuvchilar', value: stats?.totalUsers ?? 0 },
      { label: "Oylik tushum", value: stats?.monthlyRevenue ?? 0 },
      { label: "Aktiv talabalar", value: stats?.activeStudents ?? 0 },
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
        <Text style={styles.title}>{t('superadmin').homeTitle}</Text>
        <Text style={styles.subtitle}>{t('superadmin').homeSubtitle}</Text>
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
        items={superAdminMenuItems}
        excludeScreens={['SuperAdminHome']}
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
