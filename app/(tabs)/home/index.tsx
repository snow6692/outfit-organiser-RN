/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/hooks/useAuth';
import { Redirect } from 'expo-router';

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Redirect href="/" />;
  console.log(user?.email);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          {/* Placeholder for user image */}
          <View className="h-10 w-10 rounded-full bg-gray-500" />
          <Text className="ml-3 text-lg font-semibold text-white">
            Hey, {user?.name || 'new user'}!
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </View>

      {/* Tabs: Upload Items, Create Outfit, Schedule Outfits */}
      <View className="flex-row justify-around px-4 py-2">
        <TouchableOpacity className="mx-1 flex-1 items-center rounded-lg bg-gray-700 px-4 py-2">
          <Ionicons name="cloud-upload-outline" size={20} color="white" />
          <Text className="text-center text-white">Upload Items</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1 flex-1 items-center rounded-lg bg-gray-700 px-4 py-2">
          <Ionicons name="shirt-outline" size={20} color="white" />
          <Text className="text-center text-white">Create Outfit</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1 flex-1 items-center rounded-lg bg-gray-700 px-4 py-2">
          <Ionicons name="calendar-outline" size={20} color="white" />
          <Text className="text-center text-white">Schedule Outfits</Text>
        </TouchableOpacity>
      </View>

      {/* Outfit Section */}
      <ScrollView className="flex-1 px-4">
        <View className="mt-4 rounded-xl bg-gray-800 p-4">
          <Text className="mb-2 text-2xl font-bold text-blue-400">OUTFIT</Text>
          <View className="flex-row items-center">
            {/* Jacket Image */}
            <Image
              source={require('../../../assets/jacket.png')}
              className="h-36 w-24 rounded-lg"
            />
            {/* Outfit Image */}
            <Image
              source={require('../../../assets/outfit.png')}
              className="ml-4 h-48 w-36 rounded-lg"
            />
            {/* Color Swatches */}
            <View className="ml-4">
              <View className="mb-2 h-8 w-8 rounded-full bg-gray-900" />
              <View className="mb-2 h-8 w-8 rounded-full bg-gray-500" />
              <View className="h-8 w-8 rounded-full bg-gray-300" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
