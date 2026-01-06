import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './AppStackParamList';
import { colors } from '../theme/colors';
import { AppHeaderRight } from './HeaderRight';

import { SuperAdminHomeScreen } from '../screens/superadmin/SuperAdminHomeScreen';
import { CenterUsersScreen } from '../screens/superadmin/CenterUsersScreen';
import { AnalyticsScreen } from '../screens/superadmin/AnalyticsScreen';
import { LogsScreen } from '../screens/superadmin/LogsScreen';

import { SubjectsScreen } from '../screens/common/SubjectsScreen';
import { TelegramManagementScreen } from '../screens/common/TelegramManagementScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function SuperAdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.foreground,
        contentStyle: { backgroundColor: colors.background },
        headerRight: AppHeaderRight,
      }}
    >
      <Stack.Screen name="SuperAdminHome" component={SuperAdminHomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Mening fanlarim' }} />
      <Stack.Screen name="CenterUsers" component={CenterUsersScreen} options={{ title: 'Markazlar va foydalanuvchilar' }} />
      <Stack.Screen
        name="TelegramManagement"
        component={TelegramManagementScreen}
        options={{ title: 'Telegram Management' }}
      />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      <Stack.Screen name="Logs" component={LogsScreen} options={{ title: 'Logs' }} />

      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Stack.Navigator>
  );
}
