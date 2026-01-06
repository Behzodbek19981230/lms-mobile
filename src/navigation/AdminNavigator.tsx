import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './AppStackParamList';
import { colors } from '../theme/colors';
import { AppHeaderRight } from './HeaderRight';

import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { StudentsScreen } from '../screens/admin/StudentsScreen';
import { TeachersScreen } from '../screens/admin/TeachersScreen';
import { GuideScreen } from '../screens/admin/GuideScreen';

import { MyGroupsScreen } from '../screens/teacher/MyGroupsScreen';
import { EditGroupScreen } from '../screens/teacher/EditGroupScreen';
import { PaymentsScreen } from '../screens/teacher/PaymentsScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';

import { SubjectsScreen } from '../screens/common/SubjectsScreen';
import { ResultsScreen } from '../screens/common/ResultsScreen';
import { TelegramManagementScreen } from '../screens/common/TelegramManagementScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AdminNavigator() {
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
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Students" component={StudentsScreen} options={{ title: "O'quvchilarim" }} />
      <Stack.Screen name="Teachers" component={TeachersScreen} options={{ title: "O'qituvchilarim" }} />
      <Stack.Screen name="MyGroups" component={MyGroupsScreen} options={{ title: 'Guruhlar' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Natijalar' }} />
      <Stack.Screen name="Payments" component={PaymentsScreen} options={{ title: "To'lovlar" }} />
      <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Mening fanlarim' }} />
      <Stack.Screen
        name="TelegramManagement"
        component={TelegramManagementScreen}
        options={{ title: 'Telegram Management' }}
      />
      <Stack.Screen name="Guide" component={GuideScreen} options={{ title: "Foydalanish qo'llanmasi" }} />

      <Stack.Screen name="EditGroup" component={EditGroupScreen} options={{ title: 'Guruhni tahrirlash' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Stack.Navigator>
  );
}
