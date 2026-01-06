import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './AppStackParamList';
import { colors } from '../theme/colors';
import { AppHeaderRight } from './HeaderRight';

import { StudentHomeScreen } from '../screens/student/StudentHomeScreen';
import { StudentPaymentsScreen } from '../screens/student/StudentPaymentsScreen';
import { TelegramUserScreen } from '../screens/student/TelegramUserScreen';

import { SubjectsScreen } from '../screens/common/SubjectsScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function StudentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        contentStyle: { backgroundColor: colors.background },
        headerRight: () => <AppHeaderRight navigation={navigation} />,
      })}
    >
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="StudentPayments" component={StudentPaymentsScreen} options={{ title: "Mening to'lovlarim" }} />
      <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Mening fanlarim' }} />
      <Stack.Screen name="TelegramUser" component={TelegramUserScreen} options={{ title: 'Telegram' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Stack.Navigator>
  );
}
