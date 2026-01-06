import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../../contexts/AuthContext';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { colors, radii } from '../../theme/colors';
import { t } from '../../i18n';
import { getTelegramUserStatus, type TelegramUserStatus } from '../../services/telegram';

export function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [tgStatus, setTgStatus] = useState<TelegramUserStatus | null>(null);
  const [tgLoading, setTgLoading] = useState(false);

  const fullName = user ? String(user.fullName || `${user.firstName} ${user.lastName}`).trim() : '';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');

  const role = String(user.role ?? '');
  const isStudent = role.toUpperCase() === 'STUDENT';

  const tgLabel = useMemo(() => {
    if (tgLoading) return 'Yuklanmoqda...';
    if (!tgStatus) return '—';
    return tgStatus.isConnected ? 'Ulangan' : 'Ulanmagan';
  }, [tgLoading, tgStatus]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return;
      try {
        setTgLoading(true);
        const s = await getTelegramUserStatus();
        if (!alive) return;
        setTgStatus(s);
      } finally {
        if (alive) setTgLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>{t('common').notFound}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || 'U'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {fullName}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('profile').title}</Text>

        <View style={[styles.row, styles.rowFirst]}>
          <Text style={styles.label}>{t('profile').fullName}</Text>
          <Text style={styles.value} numberOfLines={2}>
            {fullName}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('profile').username}</Text>
          <Text style={styles.value}>@{user.username}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('profile').role}</Text>
          <Text style={styles.value}>{String(user.role)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{t('profile').center}</Text>
          <Text style={styles.value} numberOfLines={2}>
            {user.center?.name || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Telegram</Text>

        <View style={[styles.row, styles.rowFirst]}>
          <Text style={styles.label}>Ulanish holati</Text>
          <View style={styles.valueInline}>
            {tgLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
            <Text style={styles.value}>{tgLabel}</Text>
          </View>
        </View>

        {isStudent ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TelegramUser')}
          >
            <Text style={styles.actionButtonText}>Telegramga ulash</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('TelegramManagement')}
          >
            <Text style={styles.actionButtonText}>Telegram Management</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 24,
  },
  headerCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primaryForeground,
    fontWeight: '900',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    color: colors.foreground,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 2,
  },
  username: {
    color: colors.mutedForeground,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.foreground,
    marginBottom: 10,
  },
  row: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  label: {
    color: colors.mutedForeground,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  value: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
  valueInline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.secondaryForeground,
    fontWeight: '800',
  },
  muted: {
    color: colors.mutedForeground,
  },
});
