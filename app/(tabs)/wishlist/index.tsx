/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const WishlistScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Tabs */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row">
          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Wardrobe</Text>
            </TouchableOpacity>
          </Link>
          <Text className="mx-3 border-b-2 border-black text-lg font-semibold text-black">
            Wishlist
          </Text>
          <Link href="/(tabs)/schedule-outfits" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Schedule Outfits</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <Ionicons name="heart-outline" size={24} color="black" />
      </View>

      {/* Add Items Button */}
      <View className="px-4 py-3">
        <TouchableOpacity className="flex-row items-center justify-center rounded-full bg-gray-800 px-4 py-2">
          <Ionicons name="add" size={20} color="white" />
          <Text className="ml-2 text-white">Add Items To Your Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for Wishlist Items */}
      <ScrollView className="flex-1 px-4">
        <Text className="mt-4 text-center text-gray-500">No items in your wishlist yet.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WishlistScreen;
