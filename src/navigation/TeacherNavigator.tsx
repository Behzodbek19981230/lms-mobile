import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeacherHomeScreen } from '../screens/teacher/TeacherHomeScreen';
import { MyGroupsScreen } from '../screens/teacher/MyGroupsScreen';
import { PaymentsScreen } from '../screens/teacher/PaymentsScreen';
import { AttendanceScreen } from '../screens/teacher/AttendanceScreen';
import { TasksScreen } from '../screens/teacher/TasksScreen';
import { TasksHistoryScreen } from '../screens/teacher/TasksHistoryScreen';
import { EditGroupScreen } from '../screens/teacher/EditGroupScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';
import { ExamsScreen } from '../screens/teacher/ExamsScreen';
import { TestGeneratorScreen } from '../screens/teacher/TestGeneratorScreen';
import { GeneratedTestsScreen } from '../screens/teacher/GeneratedTestsScreen';
import { ScannerScreen } from '../screens/teacher/ScannerScreen';
import { SubjectsScreen } from '../screens/common/SubjectsScreen';
import { ResultsScreen } from '../screens/common/ResultsScreen';
import { TelegramManagementScreen } from '../screens/common/TelegramManagementScreen';
import { colors } from '../theme/colors';
import { t } from '../i18n';
import type { AppStackParamList } from './AppStackParamList';
import { AppHeaderRight } from './HeaderRight';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function TeacherNavigator() {
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
      <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Exams" component={ExamsScreen} options={{ title: 'Imtihonlar' }} />
      <Stack.Screen name="MyGroups" component={MyGroupsScreen} options={{ title: 'Mening guruhlarim' }} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Davomat' }} />
      <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Vazifalar' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Natijalar' }} />
      <Stack.Screen name="TasksHistory" component={TasksHistoryScreen} options={{ title: 'Vazifalar tarixi' }} />
      <Stack.Screen name="Payments" component={PaymentsScreen} options={{ title: "To'lovlar" }} />
      <Stack.Screen name="Subjects" component={SubjectsScreen} options={{ title: 'Mening fanlarim' }} />
      <Stack.Screen name="TestGenerator" component={TestGeneratorScreen} options={{ title: 'Test generatsiya' }} />
      <Stack.Screen name="GeneratedTests" component={GeneratedTestsScreen} options={{ title: 'Yaratilgan testlar' }} />
      <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Skaner' }} />
      <Stack.Screen
        name="TelegramManagement"
        component={TelegramManagementScreen}
        options={{ title: 'Telegram Management' }}
      />

      <Stack.Screen name="EditGroup" component={EditGroupScreen} options={{ title: t('groups').editNavTitle }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile').navTitle }} />
    </Stack.Navigator>
  );
}
