import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radii } from '../../theme/colors';
import { t } from '../../i18n';
import { showError, showSuccess } from '../../ui/toast';
import {
  createTelegramConnectLink,
  getTelegramAdminChannels,
  getTelegramUsername,
  getTelegramUserStatus,
  isTelegramLinked,
  type TelegramUserStatus,
} from '../../services/telegram';

export function TelegramManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TelegramUserStatus | null>(null);
  const [connectLink, setConnectLink] = useState<string>('');
  const [channelsCount, setChannelsCount] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    try {
      const [s, channels] = await Promise.all([
        getTelegramUserStatus(),
        getTelegramAdminChannels().catch(() => []),
      ]);
      setStatus(s);
      setChannelsCount(Array.isArray(channels) ? channels.length : 0);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Telegram maʼlumotlarini yuklab bo‘lmadi';
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

  const openUrl = async (url: string) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (!can) {
        showError(t('common').errorTitle, "Linkni ochib bo'lmadi. Linkni qo'lda browser/Telegramga qo'ying.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      showError(t('common').errorTitle, "Linkni ochib bo'lmadi. Linkni qo'lda browser/Telegramga qo'ying.");
    }
  };

  const onRefresh = async () => {
    setActionLoading(true);
    await load();
    setActionLoading(false);
  };

  const onGenerateLink = async () => {
    try {
      setActionLoading(true);
      const res = await createTelegramConnectLink();
      const link = res?.deepLink || res?.link || res?.url;
      setConnectLink(link);
      showSuccess(t('common').successTitle, 'Connect link yaratildi');
      if (link) await openUrl(link);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Connect link yaratib bo‘lmadi';
      showError(t('common').errorTitle, msg);
    } finally {
      setActionLoading(false);
    }
  };

  const onOpenLastLink = async () => {
    if (!connectLink) return;
    await openUrl(connectLink);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Ulanish holati</Text>
        <Text style={styles.muted}>
          {isTelegramLinked(status) ? 'Ulangan' : 'Ulanmagan'}
          {channelsCount !== null ? ` • Admin kanallar: ${channelsCount}` : ''}
        </Text>

        {getTelegramUsername(status) ? (
          <Text style={styles.muted}>@{getTelegramUsername(status).replace('@', '')}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.secondaryButton, actionLoading && styles.buttonDisabled]}
          onPress={onRefresh}
          disabled={actionLoading}
        >
          <Text style={styles.secondaryButtonText}>Yangilash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Connect link</Text>
        <Text style={styles.muted}>
          {connectLink ? connectLink : "Link yo'q. 'Yaratish' tugmasini bosing."}
        </Text>

        {connectLink ? (
          <TouchableOpacity
            style={[styles.secondaryButton, actionLoading && styles.buttonDisabled]}
            onPress={onOpenLastLink}
            disabled={actionLoading}
          >
            <Text style={styles.secondaryButtonText}>Linkni ochish</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.button, actionLoading && styles.buttonDisabled]}
          onPress={onGenerateLink}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>{actionLoading ? 'Kuting...' : 'Yaratish'}</Text>
        </TouchableOpacity>
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
  button: {
    marginTop: 12,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accentForeground,
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.secondaryForeground,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
