import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, radii } from '../../theme/colors';
import { showError, showInfo, showSuccess } from '../../ui/toast';
import { t } from '../../i18n';
import {
  createTelegramConnectLink,
  getTelegramUserStatus,
  getTelegramUsername,
  isTelegramLinked,
  type TelegramUserStatus,
} from '../../services/telegram';

export function TelegramUserScreen() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<TelegramUserStatus | null>(null);
  const [connectLink, setConnectLink] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const connectStartedRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollUntilRef = useRef<number>(0);

  const isConnected = isTelegramLinked(status);
  const tgUsername = getTelegramUsername(status);

  const displayName = useMemo(() => {
    const first = String(status?.firstName ?? '').trim();
    const last = String(status?.lastName ?? '').trim();
    const full = `${first} ${last}`.trim();
    return full || '—';
  }, [status?.firstName, status?.lastName]);

  const load = useCallback(async () => {
    try {
      const s = await getTelegramUserStatus();
      setStatus(s);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Telegram ma'lumotlarini yuklab bo'lmadi";
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

  const openUrl = useCallback(async (url: string) => {
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
  }, []);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    pollUntilRef.current = 0;
  }, []);

  const startPolling = useCallback(async () => {
    stopPolling();
    pollUntilRef.current = Date.now() + 60_000;

    pollTimerRef.current = setInterval(async () => {
      if (Date.now() > pollUntilRef.current) {
        stopPolling();
        return;
      }

      try {
        const s = await getTelegramUserStatus();
        setStatus(s);
        if (isTelegramLinked(s)) {
          stopPolling();
          showSuccess(t('common').successTitle, "Telegram botga muvaffaqiyatli ulandingiz");
        }
      } catch {
        // ignore intermittent errors while polling
      }
    }, 2000);
  }, [stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const startAutoConnect = useCallback(async () => {
    if (connectStartedRef.current) return;
    connectStartedRef.current = true;

    try {
      setActionLoading(true);
      const res = await createTelegramConnectLink();
      const link = String(res?.deepLink ?? res?.link ?? res?.url ?? '').trim();
      if (!link) {
        showError(t('common').errorTitle, 'Connect link topilmadi');
        return;
      }
      setConnectLink(link);
      showInfo('Telegram', "Telegram ochildi. Botda /start qiling, app avtomatik tekshiradi.");
      await openUrl(link);
      await startPolling();
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Botga ulanish havolasini olib bo'lmadi";
      showError(t('common').errorTitle, msg);
    } finally {
      setActionLoading(false);
    }
  }, [openUrl, startPolling]);

  const onConnect = useCallback(async () => {
    connectStartedRef.current = false;
    await startAutoConnect();
  }, [startAutoConnect]);

  const onOpenLastLink = useCallback(async () => {
    if (!connectLink) return;
    await openUrl(connectLink);
    await startPolling();
  }, [connectLink, openUrl, startPolling]);

  const onRefresh = useCallback(async () => {
    setActionLoading(true);
    await load();
    setActionLoading(false);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      // mimic web flow but with auto-start: if not linked, open bot connect link automatically
      if (!loading && !isConnected) {
        startAutoConnect();
      }
      return () => {
        // stop polling when leaving screen
        stopPolling();
      };
    }, [isConnected, loading, startAutoConnect, stopPolling]),
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Ulanish holati</Text>
        <Text style={styles.muted}>{isConnected ? 'Ulangan' : 'Ulanmagan'}</Text>

        <View style={styles.kv}>
          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Username</Text>
            <Text style={styles.kvValue} numberOfLines={1}>
              {tgUsername ? `@${tgUsername.replace('@', '')}` : '—'}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Ism</Text>
            <Text style={styles.kvValue} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, actionLoading && styles.buttonDisabled]}
          onPress={onRefresh}
          disabled={actionLoading}
        >
          <Text style={styles.secondaryButtonText}>Yangilash</Text>
        </TouchableOpacity>
      </View>

      {!isConnected ? (
        <View style={styles.card}>
          <Text style={styles.title}>Telegram botga ulash</Text>
          <Text style={styles.muted}>
            Ulanish avtomatik boshlanadi. Telegram ochilsa, botda /start qiling.
          </Text>

          {connectLink ? (
            <View style={styles.linkBox}>
              <Text style={styles.linkText} selectable>
                {connectLink}
              </Text>
              <TouchableOpacity
                style={[styles.secondaryButton, actionLoading && styles.buttonDisabled]}
                onPress={onOpenLastLink}
                disabled={actionLoading}
              >
                <Text style={styles.secondaryButtonText}>Linkni qayta ochish</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, actionLoading && styles.buttonDisabled]}
            onPress={onConnect}
            disabled={actionLoading}
          >
            <Text style={styles.primaryButtonText}>
              {actionLoading ? 'Kuting...' : 'Qayta ulash'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Telegram</Text>
          <Text style={styles.muted}>Sizning akkauntingiz Telegram botga ulangan.</Text>
        </View>
      )}

      {isConnected && Array.isArray(status?.availableChannels) && status!.availableChannels!.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.title}>Kanallar</Text>
          <Text style={styles.muted}>Bildirishnomalar va testlar shu kanallardan keladi.</Text>

          <View style={styles.channelsWrap}>
            {status!.availableChannels!.map((ch: any) => {
              const title = String(ch?.title || ch?.username || `Kanal ${ch?.id ?? ''}`).trim();
              const link = String(ch?.inviteLink || '').trim() || (ch?.username ? `https://t.me/${String(ch.username).replace('@', '')}` : '');
              const meta = [ch?.groupName ? `👥 ${ch.groupName}` : null, ch?.subjectName ? `📚 ${ch.subjectName}` : null, ch?.centerName ? `🏢 ${ch.centerName}` : null]
                .filter(Boolean)
                .join('  ');

              return (
                <View key={String(ch?.chatId ?? ch?.id)} style={styles.channelCard}>
                  <Text style={styles.channelTitle} numberOfLines={2}>
                    {title}
                  </Text>
                  {meta ? (
                    <Text style={styles.channelMeta} numberOfLines={2}>
                      {meta}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.secondaryButton, (!link || actionLoading) && styles.buttonDisabled]}
                    onPress={() => (link ? openUrl(link) : undefined)}
                    disabled={!link || actionLoading}
                  >
                    <Text style={styles.secondaryButtonText}>{link ? "Kanalga kirish" : "Link yo'q"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
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
    paddingBottom: 24,
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
  kv: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    gap: 8,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  kvLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '700',
    flex: 1,
  },
  kvValue: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
  linkBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: 10,
    gap: 10,
  },
  linkText: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: '700',
  },
  channelsWrap: {
    marginTop: 12,
    gap: 12,
  },
  channelCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 12,
  },
  channelTitle: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '900',
  },
  channelMeta: {
    marginTop: 6,
    color: colors.mutedForeground,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
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
