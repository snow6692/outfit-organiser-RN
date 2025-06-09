/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';

export default function WardrobeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Optional: Hide the header if not needed
      }}>
      <Stack.Screen name="edit" options={{ headerShown: true }} />
      <Stack.Screen name="settings" options={{ headerShown: true }} />
    </Stack>
  );
}
