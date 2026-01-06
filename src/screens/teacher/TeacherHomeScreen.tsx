import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { t } from '../../i18n';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { teacherMenuItems } from '../../navigation/menuDefinitions';
import { MenuScreen } from '../common/MenuScreen';

type Props = NativeStackScreenProps<AppStackParamList, 'TeacherHome'>;

export function TeacherHomeScreen({ navigation }: Props) {
  return (
    <MenuScreen
      title={t('teacher').homeTitle}
      subtitle={t('teacher').homeSubtitle}
      items={teacherMenuItems}
      dashboardScreen="TeacherHome"
      onPressItem={item => navigation.navigate(item.screen as any)}
    />
  );
}
