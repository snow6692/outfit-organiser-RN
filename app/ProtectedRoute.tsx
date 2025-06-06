/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useAuth } from '~/hooks/useAuth';
import { Redirect } from 'expo-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    console.log('User not authenticated, redirecting to /');
    return <Redirect href="/" />;
  }

  // console.log('User authenticated:', user);
  return children;
};

export default ProtectedRoute;
