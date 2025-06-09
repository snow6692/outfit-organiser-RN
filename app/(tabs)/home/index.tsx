/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useUser } from '~/hooks/useUser';

const Home = () => {
  const { user } = useUser();

  if (!user) return <Redirect href="/" />;

  return (
    <SafeAreaView className="bg-r flex-1">
      <View className="  flex-row items-center justify-between border-b border-black bg-white  px-5 py-4">
        <View className="flex-row items-center">
          {/* User Image */}

          {user.image ? (
            <Image source={{ uri: user.image }} className="h-12 w-12 rounded-full " />
          ) : (
            <Image
              source={require('../../../assets/avatar.jpg')}
              className="h-12 w-12 rounded-full "
            />
          )}
          <Text className="ml-3 text-xl font-bold tracking-wide text-black">
            Hey, {user?.name || 'Ahmed'}!
          </Text>
        </View>
      </View>

      {/* Welcome Section */}
      <View className="px-5 pb-3 pt-5">
        <Text className="text-3xl font-bold tracking-tight text-[#4A2C0F]">Your Style </Text>
        <Text className="mt-1 text-base text-[#7A5A3E]">Create your perfect outfits for today</Text>
      </View>

      {/* Outfit Section */}
      <ScrollView className="flex-1 px-5">
        {/* Featured Outfit */}
        <View className="mt-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#4A2C0F]/20">
          <Text className="mb-3 text-xl font-semibold text-[#6B4E31]">Today’s Pick</Text>
          <View className="flex-row items-center justify-between">
            <Image
              source={require('../../../assets/jacket.png')}
              className="h-40 w-28 rounded-lg"
            />
            <Image
              source={require('../../../assets/outfit.png')}
              className="h-52 w-40 rounded-lg"
            />
            <View className="ml-3 space-y-2">
              <View className="h-8 w-8 rounded-full bg-[#2C2526]" />
              <View className="h-8 w-8 rounded-full bg-[#8A7A6D]" />
              <View className="h-8 w-8 rounded-full bg-[#D9C5A9]" />
            </View>
          </View>
        </View>

        {/* Outfit Label */}
        <View className="mb-3 mt-6">
          <Text className="text-2xl font-bold tracking-tight text-[#6B4E31]">Explore Outfits</Text>
        </View>

        {/* Outfit 1 */}
        <View className="mt-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#4A2C0F]/20">
          <View className="flex-row items-center justify-between">
            <Image
              source={require('../../../assets/tshirt.png')}
              className="h-40 w-28 rounded-lg"
            />
            <Image source={require('../../../assets/jeans.png')} className="h-52 w-40 rounded-lg" />
            <View className="ml-3 space-y-2">
              <View className="h-8 w-8 rounded-full bg-[#5C4033]" />
              <View className="h-8 w-8 rounded-full bg-[#A68A64]" />
              <View className="h-8 w-8 rounded-full bg-[#D9BBA7]" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
