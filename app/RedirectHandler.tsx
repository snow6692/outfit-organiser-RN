/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useAuth } from '~/hooks/useAuth';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

const RedirectHandler = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Handle initial redirection after the layout is mounted
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // Render nothing when not loading
};

export default RedirectHandler;