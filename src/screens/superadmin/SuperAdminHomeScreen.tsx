import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuScreen } from '../common/MenuScreen';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { superAdminMenuItems } from '../../navigation/menuDefinitions';
import { t } from '../../i18n';

type Props = NativeStackScreenProps<AppStackParamList, 'SuperAdminHome'>;

export function SuperAdminHomeScreen({ navigation }: Props) {
  return (
    <MenuScreen
      title={t('superadmin').homeTitle}
      subtitle={t('superadmin').homeSubtitle}
      items={superAdminMenuItems}
      dashboardScreen="SuperAdminHome"
      onPressItem={item => navigation.navigate(item.screen as any)}
    />
  );
}
