/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpZod, type signUpZod as SignUpFormData } from '../../validations/auth.zod';
import { useRegister } from '~/hooks/useRegister';
import { useState } from 'react';

const RegisterScreen = () => {
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpZod),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert('Success', 'Signed up successfully!');
        // Navigation is now handled in useRegister hook
      },
      onError: (error: any) => {
        Alert.alert('Error', error.message || 'Registration failed. Please try again.');
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 items-center justify-start p-5"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
      <Image
        source={require('../../assets/register.png')}
        className="mt-5 h-60 w-[70%]"
        resizeMode="cover"
      />
      <Text className="mb-5 mt-10 text-4xl font-bold text-black">Sign Up</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mb-4 mt-3 w-[90%] rounded-lg border border-black p-3 ${errors.email ? 'border-2 border-red-500' : ''}`}
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
                className={`mb-4 mt-3 w-full rounded-lg border border-black p-3 ${errors.password ? 'border-2 border-red-500' : ''}`}
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <>
            <View className="relative w-[90%]">
              <TextInput
                className={`mb-4 mt-3 w-full rounded-lg border border-black p-3 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-6"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <AntDesign name={showConfirmPassword ? 'eye' : 'eyeo'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className="bg-blue mt-6 w-[55%] rounded-full border py-1"
        onPress={handleSubmit(onSubmit)}
        disabled={registerMutation.isPending}>
        <Text className="text-center text-lg font-semibold text-white">
          {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row">
        <Text className="text-gray"> Have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className="text-gray underline">Sign IN</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
