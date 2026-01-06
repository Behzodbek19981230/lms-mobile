import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuScreen } from '../common/MenuScreen';
import type { AppStackParamList } from '../../navigation/AppStackParamList';
import { studentMenuItems } from '../../navigation/menuDefinitions';

type Props = NativeStackScreenProps<AppStackParamList, 'StudentHome'>;

export function StudentHomeScreen({ navigation }: Props) {
  return (
    <MenuScreen
      title={'Dashboard'}
      subtitle={'Talaba kabineti'}
      items={studentMenuItems}
      dashboardScreen="StudentHome"
      onPressItem={item => navigation.navigate(item.screen as any)}
    />
  );
}
