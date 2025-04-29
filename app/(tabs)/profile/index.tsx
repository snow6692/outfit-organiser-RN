/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const WardrobeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Tabs */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row">
          <Text className="mx-3 border-b-2 border-black text-lg font-semibold text-black">
            Wardrobe
          </Text>
          <Link href="/wishlist" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Wishlist</Text>
            </TouchableOpacity>
          </Link>
          {/* <Link href="/schedule-outfits" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Schedule Outfits</Text>
            </TouchableOpacity>
          </Link> */}
        </View>
        <Ionicons name="heart-outline" size={24} color="black" />
      </View>

      {/* Upload New Items Button */}
      <View className="px-4 py-3">
        <TouchableOpacity className="flex-row items-center justify-center rounded-full bg-gray-800 px-4 py-2">
          <Ionicons name="add" size={20} color="white" />
          <Text className="ml-2 text-white">Upload New Items</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row justify-around px-4 py-2">
        <TouchableOpacity className="rounded-full bg-blue-500 px-4 py-2">
          <Text className="text-white">All</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-full border border-gray-300 px-4 py-2">
          <Text className="text-gray-700">Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-full border border-gray-300 px-4 py-2">
          <Text className="text-gray-700">Bottoms</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-full border border-gray-300 px-4 py-2">
          <Text className="text-gray-700">Shoes</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder Items */}
      <ScrollView className="flex-1 px-4">
        <View className="mt-4 flex-row justify-between">
          <View className="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-200">
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
          <View className="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-200">
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row justify-around border-t border-gray-200 px-4 py-3">
        <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
          <Text className="text-black">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
          <Text className="text-black">Styling</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WardrobeScreen;
