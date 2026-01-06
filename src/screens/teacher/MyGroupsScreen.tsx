import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radii } from '../../theme/colors';
import type { Group } from '../../types/group';
import { getMyGroups } from '../../services/groups';
import { t } from '../../i18n';
import { formatWeekdays } from '../../utils/weekdays';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { showError } from '../../ui/toast';

export function MyGroupsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const isFocused = useIsFocused();
  const [items, setItems] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  const load = async () => {
    setError('');
    try {
      const data = await getMyGroups();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Guruhlarni yuklab bo'lmadi";
      setError(msg);
      showError(t('common').errorTitle, msg);
    }
  };

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [isFocused]);

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
        keyExtractor={g => String(g.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.muted}>{t('groups').empty}</Text>}
        renderItem={({ item }) => {
          const studentsCount = item.studentIds?.length || item.students?.length || 0;
          const schedule = `${formatWeekdays(item.daysOfWeek)} • ${item.startTime}-${item.endTime}`;
          return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('EditGroup', { groupId: item.id })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.muted}>{schedule}</Text>
              <Text style={styles.badge}>{t('groups').studentsCount(studentsCount)}</Text>
            </Pressable>
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
    marginBottom: 4,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: 12,
  },
  badge: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '700',
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
