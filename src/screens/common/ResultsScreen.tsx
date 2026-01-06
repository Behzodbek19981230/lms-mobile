import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii } from '../../theme/colors';
import { getResultsList } from '../../services/results';
import { showError } from '../../ui/toast';
import { t } from '../../i18n';

function safeString(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function ResultsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getResultsList();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Natijalarni yuklab bo'lmadi";
      showError(t('common').errorTitle, msg);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
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
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => String(item?.id ?? item?.uniqueNumber ?? index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>{t('common').notFound}</Text>}
        renderItem={({ item }) => {
          const studentName =
            safeString(item?.student?.fullName) ||
            [safeString(item?.student?.firstName), safeString(item?.student?.lastName)]
              .filter(Boolean)
              .join(' ') ||
            safeString(item?.studentName);

          const uniqueNumber = safeString(item?.uniqueNumber);
          const score = safeString(item?.score ?? item?.result ?? item?.percent);

          return (
            <View style={styles.card}>
              <Text style={styles.title}>{studentName || 'Natija'}</Text>
              <Text style={styles.muted}>
                {uniqueNumber ? `Test: ${uniqueNumber} • ` : ''}
                {score ? `Ball: ${score}` : ''}
              </Text>
            </View>
          );
        }}
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
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 4,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
