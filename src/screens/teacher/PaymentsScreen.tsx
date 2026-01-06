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
import { getTeacherPayments } from '../../services/payments';
import type { Payment } from '../../types/payment';
import { t } from '../../i18n';
import { showError } from '../../ui/toast';

function formatPaymentStatus(raw: unknown): string {
  const s = String(raw || '').toLowerCase();
  if (s === 'pending') return t('payments').status.pending;
  if (s === 'paid') return t('payments').status.paid;
  if (s === 'overdue') return t('payments').status.overdue;
  if (s === 'cancelled') return t('payments').status.cancelled;
  return t('payments').status.unknown;
}

export function PaymentsScreen() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const load = async () => {
    setError('');
    try {
      const res = await getTeacherPayments();
      setItems(res?.payments || []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "To'lovlarni yuklab bo'lmadi";
      setError(msg);
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
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={p => String(p.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>{t('payments').empty}</Text>}
        renderItem={({ item }) => {
          const studentName = item.student ? `${item.student.firstName} ${item.student.lastName}` : '—';
          const groupName = item.group?.name || '—';
          const status = formatPaymentStatus(item.status);
          return (
            <View style={styles.card}>
              <Text style={styles.title}>{studentName}</Text>
              <Text style={styles.muted}>{groupName}</Text>
              <View style={styles.row}>
                <Text style={styles.amount}>{item.amount} {t('payments').amountSuffix}</Text>
                <Text style={styles.status}>{status}</Text>
              </View>
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.foreground,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    color: colors.primary,
    fontWeight: '800',
  },
  status: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 12,
  },
  error: {
    color: colors.destructive,
    marginBottom: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
