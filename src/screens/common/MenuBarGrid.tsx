import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MenuItem } from '../../navigation/menuDefinitions';
import { colors, radii } from '../../theme/colors';

function menuIconForScreen(screen: MenuItem['screen']): string {
  switch (screen) {
    case 'TeacherHome':
    case 'AdminHome':
    case 'SuperAdminHome':
    case 'StudentHome':
      return '🏠';
    case 'Students':
      return '🎓';
    case 'Teachers':
      return '👩‍🏫';
    case 'MyGroups':
      return '👥';
    case 'Results':
      return '📊';
    case 'Payments':
    case 'StudentPayments':
      return '💳';
    case 'Subjects':
      return '📚';
    case 'Attendance':
      return '✅';
    case 'Tasks':
      return '📌';
    case 'TasksHistory':
      return '🕓';
    case 'Exams':
      return '📝';
    case 'TestGenerator':
      return '🧪';
    case 'GeneratedTests':
      return '🧾';
    case 'Scanner':
      return '📷';
    case 'TelegramManagement':
    case 'TelegramUser':
      return '✈️';
    case 'Guide':
      return '📘';
    case 'CenterUsers':
      return '🏢';
    case 'Analytics':
      return '📈';
    case 'Logs':
      return '🗒️';
    default:
      return '•';
  }
}

export function MenuBarGrid({
  items,
  onPressItem,
  excludeScreens,
}: {
  items: MenuItem[];
  onPressItem: (item: MenuItem) => void;
  excludeScreens?: Array<MenuItem['screen']>;
}) {
  const filtered = React.useMemo(() => {
    const exclude = new Set(excludeScreens || []);
    return items.filter(i => !exclude.has(i.screen));
  }, [excludeScreens, items]);

  return (
    <View style={styles.grid}>
      {filtered.map(item => (
        <TouchableOpacity
          key={item.url}
          style={styles.tile}
          activeOpacity={0.75}
          onPress={() => onPressItem(item)}
        >
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{menuIconForScreen(item.screen)}</Text>
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  tile: {
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: 14,
    minHeight: 92,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: colors.foreground,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
});
