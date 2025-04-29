/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import { type signInZod } from '../validations/auth.zod';
import { useAuth } from './useAuth';
import { useRouter } from 'expo-router';

const loginMutationFn = async (data: signInZod) => {
  const { email, password } = data;
  const response = await loginUser(email, password);
  return response;
};

export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter(); 

  return useMutation({
    mutationFn: loginMutationFn,
    onSuccess: async (data) => {
      if (data.token && data.user) {
        await login(data.token, data.user); // Update AuthContext state
        router.replace('/home'); // Navigate to home after state update
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    },
  });
};
