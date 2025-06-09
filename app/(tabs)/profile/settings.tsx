/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '~/hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser } from '~/api/user';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SettingsScreen = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [inputError, setInputError] = useState('');

  const handleDeleteAccount = () => {
    setModalVisible(true);
    setConfirmationText('');
    setInputError('');
  };

  const confirmDeleteAccount = async () => {
    if (confirmationText.toLowerCase() !== 'delete') {
      setInputError('Please type "delete" to confirm');
      return;
    }
    setModalVisible(false);
    try {
      await deleteUser();
      Alert.alert('Success', 'Account deleted successfully');
      await AsyncStorage.removeItem('authToken');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-gray-100 flex-1 items-center justify-center">
        <Text className="text-gray-800 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  const formattedDateOfBirth = user?.dateOfBirth
    ? (() => {
        const date = new Date(user.dateOfBirth);
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      })()
    : 'Not set';

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View className="p-5">
        <Text className="text-gray-800 mb-4 text-2xl font-bold">Settings</Text>
        <TouchableOpacity
          className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-3"
          onPress={() => router.push('/profile/password')}>
          <View className="flex-row items-center">
            <Ionicons name="lock-closed" size={24} color="#6B46C1" />
            <Text className="text-gray-800 ml-2 text-lg">Password Manager</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B46C1" />
        </TouchableOpacity>
        <TouchableOpacity
          className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-3"
          onPress={handleDeleteAccount}>
          <View className="flex-row items-center">
            <Ionicons name="trash" size={24} color="#6B46C1" />
            <Text className="text-gray-800 ml-2 text-lg">Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B46C1" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/60 px-4">
          <View className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            {/* Modal Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-gray-900 text-xl font-semibold">Delete Account</Text>
              <TouchableOpacity className="p-2" onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View className="bg-gray-50 mb-5 items-center rounded-xl p-4">
              {user?.image ? (
                <Image source={{ uri: user.image }} className="mb-4 h-20 w-20 rounded-full" />
              ) : (
                <Image
                  source={require('../../../assets/avatar.jpg')}
                  className="mb-4 h-20 w-20 rounded-full"
                />
              )}
              <Text className="text-gray-600 text-sm font-medium">
                Name: {user?.name || 'Not set'}
              </Text>
              <Text className="text-gray-600 text-sm font-medium">
                Email: {user?.email || 'Not set'}
              </Text>
              <Text className="text-gray-600 text-sm font-medium">
                Date of Birth: {formattedDateOfBirth}
              </Text>
            </View>

            {/* Warning Section */}
            <View className="mb-4 flex-row items-center rounded-lg bg-red-50 p-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" className="mr-2" />
              <Text className="flex-1 text-sm text-red-600">
                This action is irreversible. All your data will be permanently deleted.
              </Text>
            </View>

            {/* Confirmation Input */}
            <View className="mb-5">
              <TextInput
                className={`border ${inputError ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg bg-white p-3 text-base ${inputError ? 'border-2' : 'border'}`}
                placeholder="Type 'delete' to confirm"
                placeholderTextColor="#9ca3af"
                onChangeText={(text) => {
                  setConfirmationText(text);
                  setInputError('');
                }}
                value={confirmationText}
                autoCapitalize="none"
              />
              {inputError && <Text className="mt-1 text-xs text-red-500">{inputError}</Text>}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                className="bg-gray-200 flex-1 items-center rounded-lg p-3"
                onPress={() => setModalVisible(false)}>
                <Text className="text-gray-800 text-base font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 items-center rounded-lg bg-red-500 p-3"
                onPress={confirmDeleteAccount}>
                <Text className="text-base font-semibold text-white">Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
