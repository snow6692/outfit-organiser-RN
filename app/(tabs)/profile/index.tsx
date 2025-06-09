/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '~/hooks/useAuth';
import { useUser } from '~/hooks/useUser';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View className="border-gray-300 border-b  p-4">
        <Text className="text-2xl font-bold text-black">Profile</Text>
      </View>
      <View className="mb-2.5 items-center bg-white p-5">
        {user.image ? (
          <Image source={{ uri: user.image }} className="size-64 rounded-full " />
        ) : (
          <Image source={require('../../../assets/avatar.jpg')} className="size-64 rounded-full " />
        )}
        <Text className="text-gray-800 text-xl font-semibold">{user?.name || 'User Name'}</Text>
      </View>
      <TouchableOpacity
        className="border-gray-200 flex-row items-center border-b bg-white p-4"
        onPress={() => router.push('/profile/edit')}>
        <Ionicons name="person" size={24} color="#514EB5" />
        <Text className="text-gray-800 ml-4 flex-1 text-lg">Your Profile</Text>
        <Ionicons name="chevron-forward" size={24} color="#514EB5" />
      </TouchableOpacity>

      <TouchableOpacity
        className="border-gray-200 flex-row items-center border-b bg-white p-4"
        onPress={() => router.push('/profile/settings')}>
        <Ionicons name="settings" size={24} color="#514EB5" />
        <Text className="text-gray-800 ml-4 flex-1 text-lg">Settings</Text>
        <Ionicons name="chevron-forward" size={24} color="#514EB5" />
      </TouchableOpacity>
      <TouchableOpacity
        className="border-gray-200 flex-row items-center border-b bg-white p-4"
        onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#514EB5" />
        <Text className="text-gray-800 ml-4 flex-1 text-lg">Log Out</Text>
        <Ionicons name="chevron-forward" size={24} color="#514EB5" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
