/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { changePassword } from '~/api/user';
import { router } from 'expo-router';

// Define the schema for password change
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
    confirmNewPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const PasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      Alert.alert('Success', 'Password updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            reset(); // Clear the form
            router.push('/');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View className="p-5">
        <Text className="text-gray-800 mb-4 text-2xl font-bold">Change Password</Text>
        <View className="mb-4">
          <Text className="text-gray-800 mb-2 text-lg font-medium">Current Password</Text>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border-gray-300 text-gray-800 rounded-lg border bg-white p-3"
                placeholder="Enter your current password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.currentPassword && (
            <Text className="mt-1 text-red-500">{errors.currentPassword.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-gray-800 mb-2 text-lg font-medium">New Password</Text>
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border-gray-300 text-gray-800 rounded-lg border bg-white p-3"
                placeholder="Enter your new password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.newPassword && (
            <Text className="mt-1 text-red-500">{errors.newPassword.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-gray-800 mb-2 text-lg font-medium">Confirm New Password</Text>
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border-gray-300 text-gray-800 rounded-lg border bg-white p-3"
                placeholder="Confirm your new password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.confirmNewPassword && (
            <Text className="mt-1 text-red-500">{errors.confirmNewPassword.message}</Text>
          )}
        </View>

        <View className="flex items-center">
          <TouchableOpacity
            className="mt-4 w-3/4 items-center rounded-full bg-blue p-2"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}>
            <Text className="text-center text-lg font-semibold text-white">
              {isSubmitting ? 'Saving...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PasswordScreen;
