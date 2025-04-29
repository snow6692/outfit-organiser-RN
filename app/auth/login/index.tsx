/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInZod, type signInZod as SignInFormData } from '../../../validations/auth.zod';
import { useLogin } from '../../../hooks/useLogin';

const LoginScreen = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInZod),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert('Success', 'Signed in successfully!');
        // Navigation is now handled in useLogin hook
      },
      onError: (error: any) => {
        Alert.alert('Error', error.message || 'Login failed. Please try again.');
      },
    });
  };

  return (
    <View className="flex-1 items-center justify-start bg-gray-400 p-5">
      <Text className="mt-10 text-3xl font-bold text-white">Sign In</Text>
      <Text className="mt-2 text-lg text-white">Hi! Welcome back, you have been missed</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mt-5 w-[90%] rounded-lg bg-gray-200 p-3 ${errors.email ? 'border-2 border-red-500' : ''}`}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mt-3 w-[90%] rounded-lg bg-gray-200 p-3 ${errors.password ? 'border-2 border-red-500' : ''}`}
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
            {errors.password && (
              <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className="mt-5 w-[90%] rounded-lg bg-gray-600 py-3"
        onPress={handleSubmit(onSubmit)}
        disabled={loginMutation.isPending}>
        <Text className="text-center text-lg font-semibold text-white">
          {loginMutation.isPending ? 'Signing In...' : 'sign In'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row">
        <TouchableOpacity className="mx-2 rounded-full bg-white p-3">
          <AntDesign name="google" />
        </TouchableOpacity>
      </View>

      <View className="mt-5 flex-row">
        <Text className="text-white">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text className="text-blue-500">SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
