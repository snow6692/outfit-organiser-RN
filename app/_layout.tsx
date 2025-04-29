/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '~/hooks/useAuth';
import RedirectHandler from './RedirectHandler';
import '../global.css';

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RedirectHandler />
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
