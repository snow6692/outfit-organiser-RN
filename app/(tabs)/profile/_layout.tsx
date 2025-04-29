/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { Stack } from 'expo-router';
import React from 'react';

const Layout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="wardrobe" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="schedule-outfits" />
    </Stack>
  );
};

export default Layout;
