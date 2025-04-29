/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth';
import { type signUpZod } from '../validations/auth.zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';

const registerMutationFn = async (data: signUpZod) => {
  const { email, password, confirmPassword } = data;
  const response = await registerUser(email, password, confirmPassword);
  return response;
};

export const useRegister = () => {
  const { login } = useAuth();
  const router = useRouter(); // Add router for navigation

  return useMutation({
    mutationFn: registerMutationFn,
    onSuccess: async (data) => {
      console.log('Registration successful:', data);
      if (data.token && data.user) {
        await login(data.token, data.user); // Update AuthContext state
        await AsyncStorage.setItem('authToken', data.token);
        router.replace('/home'); // Navigate to home after state update
      }
    },
    onError: (error: any) => {
      console.error('Registration failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    },
  });
};
