import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii } from '../../theme/colors';
import { getAnalyticsRecent, getAnalyticsSummary } from '../../services/analytics';
import { showError } from '../../ui/toast';
import { t } from '../../i18n';

export function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [recentCount, setRecentCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [s, recent] = await Promise.all([getAnalyticsSummary(), getAnalyticsRecent(50)]);
        setSummary(s);
        setRecentCount(Array.isArray(recent) ? recent.length : 0);
      } catch (e: any) {
        const msg = e?.response?.data?.message || 'Analytics yuklab bo‘lmadi';
        showError(t('common').errorTitle, msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>{t('common').loading}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.muted}>{summary ? JSON.stringify(summary) : '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Recent</Text>
        <Text style={styles.muted}>{recentCount !== null ? `${recentCount} ta event` : '—'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  muted: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});
