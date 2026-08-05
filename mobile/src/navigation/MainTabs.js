import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import MedicinesScreen from '../screens/MedicinesScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesScreen from '../screens/SalesScreen';
import ExpiryScreen from '../screens/ExpiryScreen';
import SuppliersScreen from '../screens/SuppliersScreen';
import UsersScreen from '../screens/UsersScreen';

const Tab = createBottomTabNavigator();

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <TouchableOpacity
      onPress={logout}
      style={{ backgroundColor: '#dc2626', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 }}
      hitSlop={8}
    >
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>Logout</Text>
    </TouchableOpacity>
  );
}

const TAB_META = {
  Home: { icon: '🏠', label: 'Home' },
  Medicines: { icon: '💊', label: 'Medicines' },
  Inventory: { icon: '🗃️', label: 'Inventory' },
  Sales: { icon: '💰', label: 'Sales' },
  Expiry: { icon: '⏰', label: 'Expiry' },
  Suppliers: { icon: '🤝', label: 'Suppliers' },
  Users: { icon: '👥', label: 'Users' },
};

function TabIcon({ name, focused }) {
  const meta = TAB_META[name];
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.45 }}>{meta.icon}</Text>
      <Text style={{ fontSize: 10, fontWeight: '700', color: focused ? COLORS.primary : COLORS.muted, marginTop: 1 }}>
        {meta.label}
      </Text>
    </View>
  );
}

export default function MainTabs() {
  const { user } = useAuth();
  const role = user?.role;
  const isManager = role === 'ADMIN' || role === 'PHARMACIST';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.header },
        headerTitleStyle: { color: '#fff', fontWeight: '800' },
        headerTintColor: '#fff',
        headerRight: () => <LogoutButton />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border, height: 62, paddingTop: 6 },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: () => null,
        sceneStyle: { backgroundColor: COLORS.bg },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Medicines" component={MedicinesScreen} options={{ title: 'Medicines' }} />
      {isManager && <Tab.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />}
      {isManager && <Tab.Screen name="Sales" component={SalesScreen} options={{ title: 'Sales & Purchase' }} />}
      {isManager && <Tab.Screen name="Expiry" component={ExpiryScreen} options={{ title: 'Expiry Alerts' }} />}
      {isManager && <Tab.Screen name="Suppliers" component={SuppliersScreen} options={{ title: 'Suppliers' }} />}
      {role === 'ADMIN' && <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Users' }} />}
    </Tab.Navigator>
  );
}
