/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { ActivityIndicator } from 'react-native';

const InitialRedirect = () => {
  // Redirection is handled in RedirectHandler, so this can just render a loading state
  return <ActivityIndicator />;
};

export default InitialRedirect;
