/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGetUserOutfits, useUpdateOutfit, useDeleteOutfit } from '~/hooks/useOutfitQueries';

const WishlistScreen: React.FC = () => {
  const router = useRouter();
  const { data: outfits, error: outfitsError, isLoading: outfitsLoading } = useGetUserOutfits();
  const updateOutfitMutation = useUpdateOutfit();
  const deleteOutfitMutation = useDeleteOutfit();

  const wishlistOutfits = outfits?.filter((outfit) => outfit.favorite) || [];

  console.log('Wishlist outfits:', wishlistOutfits);

  const handleToggleFavorite = (outfitId: string) => {
    Alert.alert(
      'Remove from Wishlist',
      'Remove this outfit from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Removing outfit from wishlist:', outfitId);
              await updateOutfitMutation.mutateAsync({ outfitId, favorite: false });
              alert('Outfit removed from wishlist!');
            } catch (error: any) {
              console.error('Toggle favorite error:', error.message);
              alert(error.message || 'Failed to remove from wishlist');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteOutfit = (outfitId: string) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting outfit:', outfitId);
              await deleteOutfitMutation.mutateAsync(outfitId);
              alert('Outfit deleted successfully!');
            } catch (error: any) {
              console.error('Delete outfit error:', error.message);
              alert(error.message || 'Failed to delete outfit');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderOutfitItem = ({
    item,
  }: {
    item: {
      id: string;
      images: { id: string; url: string; Category: { name: string } }[];
      favorite: boolean;
    };
  }) => {
    const categoryOrder = ['top', 'bottom', 'shoes'];
    const sortedImages = [...item.images].sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.Category.name.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.Category.name.toLowerCase());
      return aIndex - bIndex;
    });

    return (
      <View className="mb-4 rounded-lg bg-gray-100 p-4">
        <View className="flex-row justify-between">
          {sortedImages.map((image) => (
            <Image
              key={image.id}
              source={{ uri: image.url }}
              className="h-24 w-24 rounded-lg"
              resizeMode="cover"
            />
          ))}
        </View>
        <View className="absolute right-2 top-2 flex-row">
          <TouchableOpacity
            className="mr-2 rounded-full bg-red-500 p-1"
            onPress={() => handleDeleteOutfit(item.id)}>
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-full bg-red-500 p-1"
            onPress={() => handleToggleFavorite(item.id)}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text className="mx-3 text-lg text-gray-500">Wardrobe</Text>
          </TouchableOpacity>
          <Text className="mx-3 border-b-2 border-black text-lg font-semibold text-black">
            Wishlist
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/schedule-outfits')}>
            <Text className="mx-3 text-lg text-gray-500">Schedule Outfits</Text>
          </TouchableOpacity>
        </View>
        <Ionicons name="heart-outline" size={24} color="black" />
      </View>

      <View className="flex-1 px-4 py-3">
        <Text className="mb-2 text-lg font-semibold">Your Wishlist</Text>
        {outfitsLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : outfitsError ? (
          <Text className="mt-4 text-center text-red-500">
            {outfitsError.message || 'Error loading wishlist'}
          </Text>
        ) : wishlistOutfits.length > 0 ? (
          <FlatList
            data={wishlistOutfits}
            renderItem={renderOutfitItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text className="mt-4 text-center text-gray-500">
            No favorite outfits in your wishlist yet.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WishlistScreen;
