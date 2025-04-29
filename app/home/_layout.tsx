/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import ProtectedRoute from '../ProtectedRoute';

export default function RootLayout() {
  return (
    // <ProtectedRoute>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827', // bg-gray-900
          paddingVertical: 12, // py-3
          borderTopLeftRadius: 24, // rounded-t-3xl
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          paddingHorizontal: 40, // Adjust spacing between icons
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9CA3AF', // gray-400
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    // </ProtectedRoute>
  );
}
