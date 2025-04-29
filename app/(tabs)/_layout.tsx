/* eslint-disable prettier/prettier */
import { Tabs } from 'expo-router';
// eslint-disable-next-line import/order
import { Ionicons } from '@expo/vector-icons';
import ProtectedRoute from '../ProtectedRoute';

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111827',
            paddingVertical: 12,

            borderTopWidth: 0,
            paddingHorizontal: 40,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#9CA3AF',
        }}>
        <Tabs.Screen
          name="home/index"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist/index"
          options={{
            tabBarLabel: 'Wishlist',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
