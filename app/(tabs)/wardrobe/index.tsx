/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useRouter } from 'expo-router';
import { useGetAllCategories } from '~/hooks/useGetAllCategories';
import { useGetCategoryById } from '~/hooks/useGetCategoryById';
import {
  useGetUserOutfits,
  useCreateOutfit,
  useDeleteOutfit,
  useUpdateOutfit,
} from '~/hooks/useOutfitQueries';
import * as ImagePicker from 'expo-image-picker';
import { deleteImage, uploadImage } from '~/api/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadFormData, uploadSchema } from '~/validations/image.zod';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesTypes } from '../../../../back/src/types/category.types';
import axios from 'axios';
import ScheduleOutfitsScreen from './schedule-outfits';
import WishlistScreen from './wishlist';

// Clarifai utility functions
const convertImageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const mapClarifaiToCategory = (concept: string): string | null => {
  if (
    concept.includes('shirt') ||
    concept.includes('jacket') ||
    concept.includes('sweater') ||
    concept.includes('top')
  ) {
    return 'top';
  }
  if (
    concept.includes('pants') ||
    concept.includes('skirt') ||
    concept.includes('jeans') ||
    concept.includes('bottom')
  ) {
    return 'bottom';
  }
  if (
    concept.includes('shoe') ||
    concept.includes('sneaker') ||
    concept.includes('boot') ||
    concept.includes('shoes')
  ) {
    return 'shoes';
  }
  return null;
};

const classifyImage = async (imageUri: string): Promise<string | null> => {
  try {
    const base64Image = await convertImageToBase64(imageUri);
    const base64Data = base64Image.split(',')[1];
    const PAT = '6a50c2f8018946d1976cc1f8db5a6c0f';
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'apparel-detection';
    const MODEL_VERSION_ID = '1ed35c3d176f45d69d2aa7971e6ab9fe';

    const response = await axios.post(
      `https://api.clarifai.com/v2/users/${USER_ID}/apps/${APP_ID}/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      {
        inputs: [
          {
            data: {
              image: {
                base64: base64Data,
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Key ${PAT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const regions = response.data.outputs[0].data.regions || [];
    let predictedCategory: string | null = null;

    for (const region of regions) {
      const concepts = region.data.concepts || [];
      for (const concept of concepts) {
        const category = mapClarifaiToCategory(concept.name.toLowerCase());
        if (category) {
          predictedCategory = category;
          break;
        }
      }
      if (predictedCategory) break;
    }

    console.log('Clarifai Predicted Category:', predictedCategory);
    return predictedCategory;
  } catch (error: any) {
    console.error('Clarifai classification error:', error.message, error.response?.data);
    return null;
  }
};

// Generate up to 5 suitable outfit combinations
const generateOutfitCombinations = (
  selectedImages: { id: string; url: string; category: string }[]
) => {
  const tops = selectedImages.filter((img) => img.category.toLowerCase() === 'top');
  const bottoms = selectedImages.filter((img) => img.category.toLowerCase() === 'bottom');
  const shoes = selectedImages.filter((img) => img.category.toLowerCase() === 'shoes');

  if (!tops.length || !bottoms.length || !shoes.length) {
    return [];
  }

  const combinations: string[][] = [];
  const maxOutfits = 5;

  while (combinations.length < maxOutfits) {
    const top = tops[Math.floor(Math.random() * tops.length)];
    const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const shoe = shoes[Math.floor(Math.random() * shoes.length)];

    const combo = [top.id, bottom.id, shoe.id];

    if (!combinations.some((c) => c.join() === combo.join())) {
      combinations.push(combo);
    }

    if (combinations.length >= Math.min(maxOutfits, tops.length * bottoms.length * shoes.length)) {
      break;
    }
  }

  console.log('Generated Outfit Combinations:', combinations);
  return combinations;
};

const WardrobeScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'wardrobe' | 'createOutfit' | 'outfits' | 'wishlist' | 'scheduleOutfits'
  >('wardrobe');
  const [selectedImages, setSelectedImages] = useState<
    { id: string; url: string; category: string }[]
  >([]);

  const {
    data: categoryWithImages,
    error: imagesError,
    isLoading: imagesLoading,
  } = useGetCategoryById(selectedCategoryId);

  const { data: outfits, error: outfitsError, isLoading: outfitsLoading } = useGetUserOutfits();

  const createOutfitMutation = useCreateOutfit();
  const deleteOutfitMutation = useDeleteOutfit();
  const updateOutfitMutation = useUpdateOutfit();

  const { handleSubmit, setValue, reset } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      imageUri: '',
      categoryId: '',
    },
  });

  if (categoriesLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (categoriesError || !categories) {
    return (
      <Text className="mt-4 text-center text-red-500">
        {categoriesError ? categoriesError.message : 'Error loading categories'}
      </Text>
    );
  }

  console.log('Categories:', categories);
  console.log('Selected Category ID:', selectedCategoryId);
  console.log('Category Images:', categoryWithImages);
  console.log('Selected Images:', selectedImages);

  const capitalizedCategories = categories.map((category: categoriesTypes) => ({
    ...category,
    name: category.name.charAt(0).toUpperCase() + category.name.slice(1) + 's',
  }));

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setValue('imageUri', imageUri);
      console.log('Selected Image URI:', imageUri);

      setIsUploading(true);
      const predictedCategory = await classifyImage(imageUri);
      setIsUploading(false);

      if (predictedCategory) {
        const category = categories.find(
          (cat: categoriesTypes) => cat.name.toLowerCase() === predictedCategory
        );
        if (category) {
          setValue('categoryId', category.id);
          handleSubmit(onSubmit)();
        } else {
          setUploadError('Category not found in the system.');
        }
      } else {
        setUploadError('Unable to classify image. Please try again.');
      }
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    setIsUploading(true);
    setUploadError(null);

    console.log('Form Data Submitted:', data);

    try {
      await uploadImage(data.imageUri, data.categoryId);
      alert('Image uploaded successfully!');
      reset();
      if (selectedCategoryId) {
        queryClient.invalidateQueries({ queryKey: ['category', selectedCategoryId] });
      }
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteImage(imageId);
              alert('Image deleted successfully!');
              if (selectedCategoryId) {
                queryClient.invalidateQueries({ queryKey: ['category', selectedCategoryId] });
              }
            } catch (error: any) {
              alert(error.message || 'Failed to delete image');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCategorySelect = (category: categoriesTypes) => {
    setSelectedCategory(category.name);
    setSelectedCategoryId(category.id);
    console.log('Selected Category:', category);
  };

  const toggleImageSelection = (image: { id: string; url: string; category: string }) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((img) => img.id === image.id);
      if (isSelected) {
        return prev.filter((img) => img.id !== image.id);
      } else {
        return [...prev, image];
      }
    });
  };

  const generateAndSaveOutfits = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image from each category.');
      return;
    }

    const combinations = generateOutfitCombinations(selectedImages);
    if (combinations.length === 0) {
      alert(
        'No valid outfit combinations possible. Ensure you have selected tops, bottoms, and shoes.'
      );
      return;
    }

    setIsUploading(true);
    try {
      for (const combo of combinations) {
        console.log('Creating outfit with images:', combo);
        await createOutfitMutation.mutateAsync({ images: combo });
      }
      alert(`Successfully created ${combinations.length} outfits!`);
      setSelectedImages([]);
    } catch (error: any) {
      const errorMessage = error.message.includes('You can only use your own images')
        ? 'Some selected items are not available. Please choose different items and try again.'
        : error.message || 'Failed to create outfits';
      console.error('Outfit creation error:', errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
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

  const handleToggleFavorite = (outfitId: string, currentFavorite: boolean) => {
    Alert.alert(
      currentFavorite ? 'Remove from Wishlist' : 'Add to Wishlist',
      currentFavorite
        ? 'Remove this outfit from your wishlist?'
        : 'Add this outfit to your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: currentFavorite ? 'Remove' : 'Add',
          style: currentFavorite ? 'destructive' : 'default',
          onPress: async () => {
            try {
              console.log(`Toggling favorite for outfit: ${outfitId}, current: ${currentFavorite}`);
              await updateOutfitMutation.mutateAsync({ outfitId, favorite: !currentFavorite });
              alert(`Outfit ${currentFavorite ? 'removed from' : 'added to'} wishlist!`);
            } catch (error: any) {
              console.error('Toggle favorite error:', error.message);
              alert(
                error.message || `Failed to ${currentFavorite ? 'remove from' : 'add to'} wishlist`
              );
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
      <View className="bg-gray-100 mb-4 rounded-lg p-4">
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
            className={`rounded-full p-1 ${item.favorite ? 'bg-red-500' : 'bg-gray-500'}`}
            onPress={() => handleToggleFavorite(item.id, item.favorite)}>
            <Ionicons
              name={item.favorite ? 'heart' : 'heart-outline'}
              size={20}
              color={item.favorite ? 'white' : 'red'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="border-gray-200 flex-row items-center justify-between border-b px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Navbar */}
          <View className="flex-row ">
            {/* Wardrobe */}
            <TouchableOpacity onPress={() => setActiveTab('wardrobe')} className=" items-center">
              <MaterialCommunityIcons
                name={activeTab === 'wardrobe' ? 'wardrobe' : 'wardrobe-outline'}
                size={24}
                color="black"
              />
              <Text
                className={`text-md mx-3 ${
                  activeTab === 'wardrobe'
                    ? 'border-b-2 border-black font-semibold'
                    : 'text-gray-500'
                }`}>
                Wardrobe
              </Text>
            </TouchableOpacity>
            {/* Outfits */}
            <TouchableOpacity onPress={() => setActiveTab('outfits')} className=" items-center">
              <Ionicons
                name={activeTab === 'outfits' ? 'shirt' : 'shirt-outline'}
                size={24}
                color="black"
              />
              <Text
                className={`text-md mx-3 ${
                  activeTab === 'outfits'
                    ? 'border-b-2 border-black font-semibold'
                    : 'text-gray-500'
                }`}>
                Outfits
              </Text>
            </TouchableOpacity>
            {/* create */}
            {/* Create */}
            <TouchableOpacity
              onPress={() => setActiveTab('createOutfit')}
              className=" items-center">
              <Ionicons
                name={activeTab === 'createOutfit' ? 'create' : 'create-outline'}
                size={24}
                color="black"
              />
              <Text
                className={`text-md mx-3 ${
                  activeTab === 'createOutfit'
                    ? 'border-b-2 border-black font-semibold'
                    : 'text-gray-500'
                }`}>
                Create
              </Text>
            </TouchableOpacity>
            {/* Calendar */}
            <TouchableOpacity
              onPress={() => setActiveTab('scheduleOutfits')}
              className="items-center">
              {activeTab === 'scheduleOutfits' ? (
                <AntDesign name="calendar" size={24} color="black" />
              ) : (
                <Ionicons name="calendar-outline" size={24} color="black" />
              )}
              <Text
                className={`text-md mx-3 ${
                  activeTab === 'scheduleOutfits'
                    ? 'border-b-2 border-black font-semibold'
                    : 'text-gray-500'
                }`}>
                Calender
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => setActiveTab('wishlist')}>
          <Ionicons
            name={activeTab === 'wishlist' ? 'heart' : 'heart-outline'}
            size={24}
            color={activeTab === 'wishlist' ? 'red' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {activeTab === 'wardrobe' && (
        <>
          <View className="px-4 py-3">
            <TouchableOpacity
              className="bg-gray-800 flex-row items-center justify-center rounded-full px-4 py-2"
              onPress={pickImage}
              disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="add" size={25} color="white" className="rounded-full bg-blue" />
                  <Text className="ml-2">Upload New Items</Text>
                </>
              )}
            </TouchableOpacity>
            {uploadError && <Text className="mt-2 text-red-500">{uploadError}</Text>}
          </View>

          <View className="flex-row justify-around px-4 py-2">
            {capitalizedCategories.map((category: categoriesTypes) => (
              <TouchableOpacity
                key={category.id}
                className={`rounded-full px-4 py-2 ${
                  selectedCategoryId === category.id ? 'bg-blue' : 'border-gray-300 border'
                }`}
                onPress={() => handleCategorySelect(category)}>
                <Text
                  className={`${selectedCategoryId === category.id ? 'text-white' : 'text-gray-700'}`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView className="flex-1">
            {selectedCategoryId ? (
              imagesLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : imagesError ? (
                <Text className="mt-4 text-center text-red-500">{imagesError.message}</Text>
              ) : categoryWithImages?.images?.length > 0 ? (
                <View className="mt-4 flex-row flex-wrap justify-between px-4">
                  {categoryWithImages.images.map((image) => (
                    <View key={image.id} className="relative mb-4">
                      <Image
                        source={{ uri: image.url }}
                        className="h-40 w-40 rounded-lg border border-blue p-2"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1"
                        onPress={() => handleDeleteImage(image.id)}>
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 mt-4 text-center">
                  No images found for this category. Upload some items first.
                </Text>
              )
            ) : (
              <Text className="text-gray-500 mt-4 text-center">
                Please select a category to view images.
              </Text>
            )}
          </ScrollView>
        </>
      )}

      {activeTab === 'createOutfit' && (
        <View className="flex-1 px-4 py-3">
          <Text className="mb-2 text-lg font-semibold">Select Items for Outfit</Text>
          <View className="flex-row justify-around px-4 py-2">
            {capitalizedCategories.map((category: categoriesTypes) => (
              <TouchableOpacity
                key={category.id}
                className={`rounded-full px-4 py-2 ${
                  selectedCategoryId === category.id ? 'bg-blue' : 'border-gray-300 border'
                }`}
                onPress={() => handleCategorySelect(category)}>
                <Text
                  className={`${selectedCategoryId === category.id ? 'text-white' : 'text-gray-700'}`}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView className="flex-1">
            {selectedCategoryId ? (
              imagesLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : imagesError ? (
                <Text className="mt-4 text-center text-red-500">{imagesError.message}</Text>
              ) : categoryWithImages?.images?.length > 0 ? (
                <View className="mt-4 flex-row flex-wrap justify-between px-4">
                  {categoryWithImages.images.map((image) => {
                    const isSelected = selectedImages.some((img) => img.id === image.id);
                    return (
                      <TouchableOpacity
                        key={image.id}
                        className="relative mb-4"
                        onPress={() =>
                          toggleImageSelection({
                            id: image.id,
                            url: image.url,
                            category: categoryWithImages.name.toLowerCase(),
                          })
                        }>
                        <Image
                          source={{ uri: image.url }}
                          className={`h-40 w-40 rounded-lg ${isSelected ? 'border-blue-500 border-4' : ''}`}
                          resizeMode="cover"
                        />
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="blue"
                            style={{ position: 'absolute', right: 8, top: 8 }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text className="mt-4 text-center text-red-500">
                  No images found for this category. Upload some items first.
                </Text>
              )
            ) : (
              <Text className="text-gray-500 mt-4 text-center">
                Please select a category to view images.
              </Text>
            )}
          </ScrollView>
          <TouchableOpacity
            className="mt-4 rounded-full bg-blue px-4 py-2"
            onPress={generateAndSaveOutfits}
            disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className=" flex-row  items-center justify-center ">
                <Ionicons name="create" size={24} color="white" />
                <Text className="text-center text-white">Generate Outfits</Text>
              </View>
            )}
          </TouchableOpacity>
          {selectedImages.length > 0 && (
            <Text className="text-gray-600 mt-2 text-center">
              Selected {selectedImages.length} items
            </Text>
          )}
        </View>
      )}

      {activeTab === 'outfits' && (
        <View className="flex-1 px-4 py-3">
          <Text className="mb-2 text-lg font-semibold">Your Outfits</Text>
          {outfitsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : outfitsError ? (
            <Text className="mt-4 text-center text-red-500">{outfitsError.message}</Text>
          ) : outfits && outfits.length > 0 ? (
            <FlatList
              data={outfits}
              renderItem={renderOutfitItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <Text className="text-gray-500 mt-4 text-center">No outfits found.</Text>
          )}
        </View>
      )}

      {activeTab === 'wishlist' && <WishlistScreen />}

      {activeTab === 'scheduleOutfits' && <ScheduleOutfitsScreen />}
    </SafeAreaView>
  );
};

export default WardrobeScreen;
