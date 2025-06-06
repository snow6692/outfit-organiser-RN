/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
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
            backgroundColor: 'white',
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}>
        <Tabs.Screen
          name="home/index"
          options={{
            href: '/home',
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={'#514EB5'} />
            ),
          }}
        />
        <Tabs.Screen
          name="wardrobe"
          options={{
            href: '/wardrobe',
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'image-outline' : 'images-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            href: '/profile',
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
