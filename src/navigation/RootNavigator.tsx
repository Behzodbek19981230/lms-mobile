import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { TeacherNavigator } from './TeacherNavigator';
import { AdminNavigator } from './AdminNavigator';
import { SuperAdminNavigator } from './SuperAdminNavigator';
import { StudentNavigator } from './StudentNavigator';

export type RootStackParamList = {
  Login: undefined;
  Teacher: undefined;
  Admin: undefined;
  SuperAdmin: undefined;
  Student: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useContext(AuthContext);
  const role = String(user?.role ?? '').toUpperCase();
  const isStudent = role === 'STUDENT';
  const isAdmin = role === 'ADMIN';
  const isSuperAdmin = role === 'SUPERADMIN' || role === 'SUPER_ADMIN';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          isStudent ? (
            <Stack.Screen name="Student" component={StudentNavigator} />
          ) : isSuperAdmin ? (
            <Stack.Screen name="SuperAdmin" component={SuperAdminNavigator} />
          ) : isAdmin ? (
            <Stack.Screen name="Admin" component={AdminNavigator} />
          ) : (
            <Stack.Screen name="Teacher" component={TeacherNavigator} />
          )
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
