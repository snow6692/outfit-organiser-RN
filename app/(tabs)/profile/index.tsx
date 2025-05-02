/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Modal,
//   Image,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { Link, useRouter } from 'expo-router';
// import { useGetAllCategories } from '~/hooks/useGetAllCategories';
// import { useGetCategoryById } from '~/hooks/useGetCategoryById';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadImage, deleteImage } from '~/api/image';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { UploadFormData, uploadSchema } from '~/validations/image.zod';
// import { useQueryClient } from '@tanstack/react-query';
// import { categoriesTypes } from '../../../../back/src/types/category.types';

// // Define the shape of a category

// const WardrobeScreen: React.FC = () => {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const {
//     data: categories,
//     error: categoriesError,
//     isLoading: categoriesLoading,
//   } = useGetAllCategories();
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);

//   // Fetch images for the selected category
//   const {
//     data: categoryWithImages,
//     error: imagesError,
//     isLoading: imagesLoading,
//   } = useGetCategoryById(selectedCategoryId);

//   // Set up react-hook-form with zod resolver
//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<UploadFormData>({
//     resolver: zodResolver(uploadSchema),
//     defaultValues: {
//       imageUri: '',
//       categoryId: '',
//     },
//   });

//   if (categoriesLoading) return <ActivityIndicator size="large" color="#0000ff" />;
//   if (categoriesError || !categories) {
//     return (
//       <Text className="mt-4 text-center text-red-500">
//         {categoriesError ? categoriesError.message : 'Error loading categories'}
//       </Text>
//     );
//   }

//   console.log('Fetched Categories:', categories);

//   // Capitalize category names for display (e.g., "top" → "Tops")
//   const capitalizedCategories = categories.map((category: categoriesTypes) => ({
//     ...category,
//     name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
//   }));

//   // Function to pick an image from the gallery
//   const pickImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permissionResult.granted) {
//       alert('Permission to access gallery is required!');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const imageUri = result.assets[0].uri;
//       setValue('imageUri', imageUri);
//       setModalVisible(true);
//       console.log('Selected Image URI:', imageUri);
//     }
//   };

//   // Function to handle form submission (upload)
//   const onSubmit = async (data: UploadFormData) => {
//     setIsUploading(true);
//     setUploadError(null);

//     console.log('Form Data Submitted:', data);

//     try {
//       await uploadImage(data.imageUri, data.categoryId);
//       alert('Image uploaded successfully!');
//       setModalVisible(false);
//       reset();
//       // Refetch images for the selected category
//       if (selectedCategoryId) {
//         queryClient.invalidateQueries({ queryKey: ['category', selectedCategoryId] });
//       }
//     } catch (error: any) {
//       setUploadError(error.message || 'Failed to upload image');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Function to handle image deletion
//   const handleDeleteImage = (imageId: string) => {
//     Alert.alert(
//       'Delete Image',
//       'Are you sure you want to delete this image?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteImage(imageId);
//               alert('Image deleted successfully!');
//               // Refetch images for the selected category
//               if (selectedCategoryId) {
//                 queryClient.invalidateQueries({ queryKey: ['category', selectedCategoryId] });
//               }
//             } catch (error: any) {
//               alert(error.message || 'Failed to delete image');
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   // Handle category selection (for both filter and upload)
//   const handleCategorySelect = (category: categoriesTypes) => {
//     setSelectedCategory(category.name);
//     setSelectedCategoryId(category.id);
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header with Tabs */}
//       <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <View className="flex-row">
//           <Text className="mx-3 border-b-2 border-black text-lg font-semibold text-black">
//             Wardrobe
//           </Text>
//           <Link href="/wishlist" asChild>
//             <TouchableOpacity>
//               <Text className="mx-3 text-lg text-gray-500">Wishlist</Text>
//             </TouchableOpacity>
//           </Link>
//         </View>
//         <Ionicons name="heart-outline" size={24} color="black" />
//       </View>

//       {/* Upload New Items Button */}
//       <View className="px-4 py-3">
//         <TouchableOpacity
//           className="flex-row items-center justify-center rounded-full bg-gray-800 px-4 py-2"
//           onPress={pickImage}
//           disabled={isUploading}>
//           {isUploading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <>
//               <Ionicons name="add" size={20} color="white" />
//               <Text className="ml-2 text-white">Upload New Items</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Category Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(false);
//           setUploadError(null);
//           reset();
//         }}>
//         <View className="flex-1 items-center justify-center bg-black/50">
//           <View className="w-3/4 rounded-lg bg-white p-4">
//             <Text className="mb-4 text-lg font-semibold">Select Category</Text>

//             {/* Category Selection */}
//             <Controller
//               control={control}
//               name="categoryId"
//               render={({ field: { onChange, value } }) => (
//                 <View>
//                   {capitalizedCategories.map((category: categoriesTypes) => (
//                     <TouchableOpacity
//                       key={category.id}
//                       className="border-b border-gray-200 p-2"
//                       onPress={() => onChange(category.id)}>
//                       <Text
//                         className={`text-lg ${
//                           value === category.id ? 'text-blue-500' : 'text-black'
//                         }`}>
//                         {category.name}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             />
//             {errors.categoryId && (
//               <Text className="mt-2 text-red-500">{errors.categoryId.message}</Text>
//             )}

//             {/* Image Selection Error */}
//             {errors.imageUri && (
//               <Text className="mt-2 text-red-500">{errors.imageUri.message}</Text>
//             )}

//             {/* Upload Error */}
//             {uploadError && <Text className="mt-2 text-red-500">{uploadError}</Text>}

//             {/* Modal Buttons */}
//             <View className="mt-4 flex-row justify-around">
//               <TouchableOpacity
//                 className="rounded-lg bg-gray-300 px-4 py-2"
//                 onPress={() => {
//                   setModalVisible(false);
//                   setUploadError(null);
//                   reset();
//                 }}>
//                 <Text>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="rounded-lg bg-blue-500 px-4 py-2"
//                 onPress={handleSubmit(onSubmit)}
//                 disabled={isUploading}>
//                 {isUploading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text className="text-white">Upload</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Filter Buttons (Dynamic Categories) */}
//       <View className="flex-row justify-around px-4 py-2">
//         {capitalizedCategories.map((category: categoriesTypes) => (
//           <TouchableOpacity
//             key={category.name}
//             className={`rounded-full px-4 py-2 ${
//               selectedCategory === category.name ? 'bg-blue-500' : 'border border-gray-300'
//             }`}
//             onPress={() => handleCategorySelect(category)}>
//             <Text
//               className={`${selectedCategory === category.name ? 'text-white' : 'text-gray-700'}`}>
//               {category.name}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Display Images for the Selected Category */}
//       <ScrollView className="flex-1 px-4">
//         {selectedCategoryId ? (
//           imagesLoading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : imagesError ? (
//             <Text className="mt-4 text-center text-red-500">{imagesError.message}</Text>
//           ) : categoryWithImages && categoryWithImages.images.length > 0 ? (
//             <View className="mt-4 flex-row flex-wrap justify-between">
//               {categoryWithImages.images.map((image) => (
//                 <View key={image.id} className="relative mb-4">
//                   <Image
//                     source={{ uri: image.url }}
//                     className="h-40 w-40 rounded-lg"
//                     resizeMode="cover"
//                   />
//                   {/* Delete Icon */}
//                   <TouchableOpacity
//                     className="absolute right-2 top-2 rounded-full bg-red-500 p-1"
//                     onPress={() => handleDeleteImage(image.id)}>
//                     <Ionicons name="close" size={20} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <Text className="mt-4 text-center text-gray-500">
//               No images found for this category.
//             </Text>
//           )
//         ) : (
//           <Text className="mt-4 text-center text-gray-500">
//             Please select a category to view images.
//           </Text>
//         )}
//       </ScrollView>

//       {/* Bottom Buttons */}
//       <View className="flex-row justify-around border-t border-gray-200 px-4 py-3">
//         <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
//           <Text className="text-black">Add</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="rounded-lg border border-gray-300 px-4 py-2">
//           <Text className="text-black">Styling</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default WardrobeScreen;

/* eslint-disable prettier/prettier */
/* eslint-disable import/order */

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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useGetAllCategories } from '~/hooks/useGetAllCategories';

/* eslint-disable prettier/prettier */
/* eslint-disable import/order */

import * as ImagePicker from 'expo-image-picker';
import { uploadImage, deleteImage } from '~/api/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadFormData, uploadSchema } from '~/validations/image.zod';
import { useQueryClient } from '@tanstack/react-query';
import { categoriesTypes } from '../../../../back/src/types/category.types';
import axios from 'axios';
import { useGetCategoryById } from '~/hooks/useGetCategoryById';

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
    const base64Data = base64Image.split(',')[1]; // Remove "data:image/jpeg;base64," prefix

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

    // Parse regions and concepts
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
    console.error('Clarifai classification error:', error.message);
    return null;
  }
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

  const {
    data: categoryWithImages,
    error: imagesError,
    isLoading: imagesLoading,
  } = useGetCategoryById(selectedCategoryId);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
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

  const capitalizedCategories = categories.map((category: categoriesTypes) => ({
    ...category,
    name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
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

      // Classify image with Clarifai
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
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
        </View>
        <Ionicons name="heart-outline" size={24} color="black" />
      </View>

      <View className="px-4 py-3">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-full bg-gray-800 px-4 py-2"
          onPress={pickImage}
          disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="add" size={20} color="white" />
              <Text className="ml-2 text-white">Upload New Items</Text>
            </>
          )}
        </TouchableOpacity>
        {uploadError && <Text className="mt-2 text-red-500">{uploadError}</Text>}
      </View>

      <View className="flex-row justify-around px-4 py-2">
        {capitalizedCategories.map((category: categoriesTypes) => (
          <TouchableOpacity
            key={category.name}
            className={`rounded-full px-4 py-2 ${
              selectedCategory === category.name ? 'bg-blue-500' : 'border border-gray-300'
            }`}
            onPress={() => handleCategorySelect(category)}>
            <Text
              className={`${selectedCategory === category.name ? 'text-white' : 'text-gray-700'}`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4">
        {selectedCategoryId ? (
          imagesLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : imagesError ? (
            <Text className="mt-4 text-center text-red-500">{imagesError.message}</Text>
          ) : categoryWithImages && categoryWithImages.images.length > 0 ? (
            <View className="mt-4 flex-row flex-wrap justify-between">
              {categoryWithImages.images.map((image) => (
                <View key={image.id} className="relative mb-4">
                  <Image
                    source={{ uri: image.url }}
                    className="h-40 w-40 rounded-lg"
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
            <Text className="mt-4 text-center text-gray-500">
              No images found for this category.
            </Text>
          )
        ) : (
          <Text className="mt-4 text-center text-gray-500">
            Please select a category to view images.
          </Text>
        )}
      </ScrollView>

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
