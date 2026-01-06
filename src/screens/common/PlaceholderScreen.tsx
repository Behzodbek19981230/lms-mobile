import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../../theme/colors';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Bu bo'lim mobil versiyada hozircha minimal holatda.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
});
