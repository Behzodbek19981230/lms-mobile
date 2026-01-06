import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuScreen } from '../common/MenuScreen';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { centerAdminMenuItems } from '../../navigation/menuDefinitions';
import { t } from '../../i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'AdminHome'>;

export function AdminHomeScreen({ navigation }: Props) {
  return (
    <MenuScreen
      title={t('admin').homeTitle}
      subtitle={t('admin').homeSubtitle}
      items={centerAdminMenuItems}
      dashboardScreen="AdminHome"
      onPressItem={item => navigation.navigate(item.screen as any)}
    />
  );
}
