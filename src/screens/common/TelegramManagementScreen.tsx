import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  getTelegramUserStatus,
  type TelegramUserStatus,
} from '../../services/telegram';

export function TelegramManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TelegramUserStatus | null>(null);
  const [connectLink, setConnectLink] = useState<string>('');
  const [channelsCount, setChannelsCount] = useState<number | null>(null);

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

  const onGenerateLink = async () => {
    try {
      const res = await createTelegramConnectLink();
      const link = String(res?.link ?? res?.url ?? '');
      setConnectLink(link);
      showSuccess(t('common').successTitle, 'Connect link yaratildi');
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Connect link yaratib bo‘lmadi';
      showError(t('common').errorTitle, msg);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Ulanish holati</Text>
        <Text style={styles.muted}>
          {status?.isConnected ? 'Ulangan' : 'Ulanmagan'}
          {channelsCount !== null ? ` • Admin kanallar: ${channelsCount}` : ''}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Connect link</Text>
        <Text style={styles.muted}>
          {connectLink ? connectLink : "Link yo'q. 'Yaratish' tugmasini bosing."}
        </Text>

        <TouchableOpacity style={styles.button} onPress={onGenerateLink}>
          <Text style={styles.buttonText}>Yaratish</Text>
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
});
