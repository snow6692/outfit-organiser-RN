/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useUser } from '~/hooks/useUser';
import { useGetUserOutfits } from '~/hooks/useOutfitQueries';
import { useGetUserSchedules } from '~/hooks/useSchedule';
import { isToday } from 'date-fns';

const Home = () => {
  const { user } = useUser();
  const { data: outfits = [], isLoading: outfitsLoading } = useGetUserOutfits();
  const { data: schedules = [], isLoading: schedulesLoading } = useGetUserSchedules();

  if (!user) return <Redirect href="/" />;

  // Find outfit scheduled for today
  const todaySchedule = schedules.find((s) => isToday(new Date(s.date)));
  const todayOutfit = todaySchedule ? outfits.find((o) => o.id === todaySchedule.outfitId) : null;

  // Use today's scheduled outfit if available, otherwise use the first available outfit
  const selectedOutfit = todayOutfit || outfits[0];

  // Function to sort images by category: Top > Bottom > Shoes
  const sortImagesByCategory = (images: any[]) => {
    return [...images]
      .sort((a, b) => {
        const categoryOrder: { [key: string]: number } = {
          top: 1,
          bottom: 2,
          shoes: 3,
        };
        const aOrder = categoryOrder[a.Category?.name?.toLowerCase()] || 99;
        const bOrder = categoryOrder[b.Category?.name?.toLowerCase()] || 99;
        return aOrder - bOrder;
      })
      .slice(0, 3);
  };

  // Default colors if no images are available
  const defaultColors = ['#5C4033', '#A68A64', '#D9BBA7'];

  return (
    <SafeAreaView className="bg-r flex-1">
      <View className="flex-row items-center justify-between border-b border-black bg-white px-5 py-4">
        <View className="flex-row items-center">
          {/* User Image */}
          {user.image ? (
            <Image source={{ uri: user?.image }} className="h-12 w-12 rounded-full" />
          ) : (
            <Image
              source={require('../../../assets/avatar.jpg')}
              className="h-12 w-12 rounded-full"
            />
          )}
          <Text className="ml-3 text-xl font-bold tracking-wide text-black">
            Hey, {user?.name || 'Ahmed'}!
          </Text>
        </View>
      </View>

      {/* Welcome Section */}
      <View className="px-5 pb-3 pt-5">
        <Text className="text-3xl font-bold tracking-tight text-[#4A2C0F]">Your Style</Text>
        <Text className="mt-1 text-base text-[#7A5A3E]">Create your perfect outfits for today</Text>
      </View>

      {/* Outfit Section */}
      <ScrollView className="flex-1 px-5">
        {/* Featured Outfit (Static) */}
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
          <Text className="text-2xl font-bold tracking-tight text-[#6B4E31]">
            {todayOutfit ? 'Today’s Scheduled Outfit' : 'Explore Outfits'}
          </Text>
        </View>

        {/* Outfit 2 (Dynamic or Static) */}
        {outfitsLoading || schedulesLoading ? (
          <View className="mt-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#4A2C0F]/20">
            <Text className="text-gray-500 text-center">Loading...</Text>
          </View>
        ) : selectedOutfit ? (
          <View className="mt-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#4A2C0F]/20">
            <View className="flex-row items-center justify-between">
              {sortImagesByCategory(selectedOutfit.images || []).map(
                (image: any, index: number) => (
                  <Image
                    key={image.id || index}
                    source={{ uri: image.url || 'https://via.placeholder.com/50' }}
                    className="h-40 w-28 rounded-lg"
                  />
                )
              )}
              <View className="ml-3 space-y-2">
                {(selectedOutfit.images?.length >= 3
                  ? sortImagesByCategory(selectedOutfit.images).map((image: any) => image.color)
                  : defaultColors
                ).map((color: string, index: number) => (
                  <View
                    key={index}
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View className="mt-3 rounded-2xl bg-white p-5 shadow-lg shadow-[#4A2C0F]/20">
            <View className="flex-row items-center justify-between">
              <Image
                source={require('../../../assets/tshirt.png')}
                className="h-40 w-28 rounded-lg"
              />
              <Image
                source={require('../../../assets/jeans.png')}
                className="h-52 w-40 rounded-lg"
              />
              <View className="ml-3 space-y-2">
                <View className="h-8 w-8 rounded-full bg-[#5C4033]" />
                <View className="h-8 w-8 rounded-full bg-[#A68A64]" />
                <View className="h-8 w-8 rounded-full bg-[#D9BBA7]" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
