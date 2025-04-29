/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpZod, type signUpZod as SignUpFormData } from '../../validations/auth.zod';
import { useRegister } from '~/hooks/useRegister';

const RegisterScreen = () => {
  const router = useRouter();
  const registerMutation = useRegister();

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
    <View className="flex-1 items-center justify-start bg-gray-400 p-5">
      <Text className="mt-10 text-3xl font-bold text-white">Sign Up</Text>
      <Text className="mt-2 text-center text-lg text-white">
        Fill your information below or register with your social account.
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mt-3 w-[90%] rounded-lg bg-gray-200 p-3 ${errors.email ? 'border-2 border-red-500' : ''}`}
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              className={`mt-3 w-[90%] rounded-lg bg-gray-200 p-3 ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
              placeholder="Confirm Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className="mt-5 w-[90%] rounded-lg bg-gray-600 py-3"
        onPress={handleSubmit(onSubmit)}
        disabled={registerMutation.isPending}>
        <Text className="text-center text-lg font-semibold text-white">
          {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row">
        <TouchableOpacity className="mx-2 rounded-full bg-white p-3">
          <AntDesign name="google" />
        </TouchableOpacity>
      </View>

      <View className="mt-5 flex-row">
        <Text className="text-white">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className="text-blue-500">Sign IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
