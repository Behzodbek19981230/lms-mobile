import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { colors, radii } from '../theme/colors';

export function DashboardScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assalomu alaykum{user?.fullName ? `, ${user.fullName}` : ''}</Text>
      <Text style={styles.subtitle}>Siz tizimga muvaffaqiyatli kirdingiz.</Text>

      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accentForeground,
    fontWeight: '700',
    fontSize: 16,
  },
});
