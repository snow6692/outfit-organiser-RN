/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInZod, type signInZod as SignInFormData } from '../../validations/auth.zod';
import { useLogin } from '~/hooks/useLogin';
import { useState } from 'react';

const LoginScreen = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
      },
      onError: (error: any) => {
        if (error.response?.status === 401) {
          Alert.alert('Error', 'Email or password is incorrect.');
        } else {
          Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
        }
      },
    });
  };

  return (
    <View className="flex-1 items-center justify-start bg-white p-5">
      <Image
        source={require('../../assets/login.png')}
        className="mt-5 h-60 w-[70%]"
        resizeMode="cover"
      />
      <Text className="mb-4 mt-10 text-4xl font-bold text-black">Sign In</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mb-4 mt-5 w-[90%] rounded-lg border border-black p-3 ${errors.email ? 'border-2 border-red-500' : ''}`}
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
            <View className="relative w-[90%]">
              <TextInput
                className={`mt-3 w-full rounded-lg border border-black p-3 ${errors.password ? 'border-2 border-red-500' : ''}`}
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-6"
                onPress={() => setShowPassword(!showPassword)}>
                <AntDesign name={showPassword ? 'eye' : 'eyeo'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className="bg-blue mt-12 w-[55%] rounded-full border py-1"
        onPress={handleSubmit(onSubmit)}
        disabled={loginMutation.isPending}>
        <Text className="text-center text-lg font-semibold text-white">
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row">
        <Text className="text-gray">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text className="text-gray underline">SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
