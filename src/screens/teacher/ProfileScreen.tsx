import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { colors, radii } from '../../theme/colors';
import { t } from '../../i18n';

export function ProfileScreen() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>{t('common').notFound}</Text>
      </View>
    );
  }

  const fullName = user.fullName || `${user.firstName} ${user.lastName}`;
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');

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
  muted: {
    color: colors.mutedForeground,
  },
});
