/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';

export default function WardrobeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Optional: Hide the header if not needed
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="wishlist" options={{ headerShown: false }} />
      <Stack.Screen name="schedule-outfit" options={{ headerShown: false }} />
    </Stack>
  );
}
