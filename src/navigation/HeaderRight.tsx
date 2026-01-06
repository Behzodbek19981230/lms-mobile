import React, { useCallback, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import type { AppStackParamList } from './AppStackParamList';
import { colors } from '../theme/colors';
import { showSuccess } from '../ui/toast';
import { t } from '../i18n';

export function AppHeaderRight({
  navigation,
}: {
  navigation: NativeStackNavigationProp<AppStackParamList>;
}) {
  const { logout } = useContext(AuthContext);

  const onLogout = useCallback(async () => {
    await logout();
    showSuccess(t('common').successTitle, t('common').loggedOut);
  }, [logout]);

  return (
    <View style={styles.headerRight}>
      <Pressable
        onPress={() => navigation.navigate('Profile')}
        style={styles.headerBtn}
        hitSlop={8}
      >
        <Text style={styles.headerBtnText}>{t('profile').navTitle}</Text>
      </Pressable>
      <Pressable onPress={onLogout} style={styles.headerBtn} hitSlop={8}>
        <Text style={styles.headerBtnText}>{t('common').logout}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
});
