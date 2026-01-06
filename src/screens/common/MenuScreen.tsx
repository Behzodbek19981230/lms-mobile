import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii } from '../../theme/colors';
import type { MenuItem } from '../../navigation/menuDefinitions';
import { filterMenuItemsByCenterPermissions } from '../../navigation/menuFilter';
import { AuthContext } from '../../contexts/AuthContext';

export function MenuScreen({
  title,
  subtitle,
  items,
  dashboardScreen,
  onPressItem,
}: {
  title: string;
  subtitle: string;
  items: MenuItem[];
  dashboardScreen: MenuItem['screen'];
  onPressItem: (item: MenuItem) => void;
}) {
  const { user } = React.useContext(AuthContext);
  const role = String(user?.role ?? '').toUpperCase();
  const isSuperAdmin = role === 'SUPERADMIN' || role === 'SUPER_ADMIN';

  const filteredItems = filterMenuItemsByCenterPermissions(items, {
    isSuperAdmin,
    centerPermissions: user?.center?.permissions,
  });

  // dashboard item should always exist (1:1 with web). If filtered out, keep it.
  const finalItems = React.useMemo(() => {
    const hasDashboard = filteredItems.some(i => i.screen === dashboardScreen);
    if (hasDashboard) return filteredItems;
    const dash = items.find(i => i.screen === dashboardScreen);
    return dash ? [dash, ...filteredItems] : filteredItems;
  }, [filteredItems, items, dashboardScreen]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {finalItems.map(item => (
        <TouchableOpacity
          key={item.url}
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => onPressItem(item)}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
          <Text style={styles.cardDesc} numberOfLines={1}>
            {item.url}
          </Text>
        </TouchableOpacity>
      ))}
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
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 4,
    flex: 1,
  },
  chevron: {
    color: colors.mutedForeground,
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});
