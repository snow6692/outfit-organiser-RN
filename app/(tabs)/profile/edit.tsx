/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '~/hooks/useUser';
import { userSchema, UserFormData } from '~/validations/user.zod';
import * as ImagePicker from 'expo-image-picker';

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

const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) =>
  (1900 + i).toString()
).reverse();

const EditProfileScreen = () => {
  const { user, isLoading, updateUser: updateUserData } = useUser();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  let defaultDay = '';
  let defaultMonth = '';
  let defaultYear = '';
  let formattedDateOfBirth = '';
  if (user?.dateOfBirth) {
    const date = new Date(user.dateOfBirth);
    defaultDay = date.getDate().toString();
    defaultMonth = months[date.getMonth()];
    defaultYear = date.getFullYear().toString();
    formattedDateOfBirth = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      day: defaultDay,
      month: defaultMonth,
      year: defaultYear,
    },
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const day = watch('day');
  const month = watch('month');
  const year = watch('year');

  let days: string[] = [];
  if (month && year) {
    const monthIndex = months.indexOf(month) + 1;
    const daysInMonth = new Date(parseInt(year), monthIndex, 0).getDate();
    days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  } else {
    days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  }

  const onSubmit = async (data: UserFormData) => {
    let dateOfBirth = undefined;
    if (data.day && data.month && data.year) {
      const monthIndex = months.indexOf(data.month) + 1;
      dateOfBirth = `${data.year}-${monthIndex.toString().padStart(2, '0')}-${data.day.padStart(2, '0')}`;
    }

    const updateData = {
      name: data.name,
      dateOfBirth,
      image: selectedImage || undefined,
    };

    try {
      await updateUserData(updateData);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-gray-100 flex-1 items-center justify-center">
        <Text className="text-gray-800 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-100 flex-1">
      <View className="p-5">
        <View className="mb-4">
          <TouchableOpacity
            className="border-gray-300 relative flex-row items-center  justify-center "
            onPress={pickImage}>
            <Ionicons
              name="pencil-sharp"
              size={24}
              color={'white'}
              className="absolute  bottom-0 right-24 z-10  rounded-full bg-blue p-1  "
            />
            {user.image ? (
              <Image source={{ uri: user.image }} className="size-64 rounded-full " />
            ) : (
              <Image
                source={require('../../../assets/avatar.jpg')}
                className="size-64 rounded-full "
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Text className="text-gray-800 mb-2 text-lg font-medium">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border-gray-300 text-gray-800 rounded-lg border bg-white p-3"
                placeholder="Enter your name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && <Text className="mt-1 text-red-500">{errors.name.message}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-gray-800 mb-2 text-lg font-medium">Date of Birth</Text>
          {user?.dateOfBirth && (
            <Text className="text-gray-600 mb-2">
              Current Birthday: {formattedDateOfBirth || user.dateOfBirth}
            </Text>
          )}
          <View className="flex-row justify-between">
            <Controller
              control={control}
              name="day"
              render={({ field: { onChange, value } }) => (
                <View className="mr-2 flex-1">
                  <View className="border-gray-300 rounded-lg border bg-white">
                    <Picker selectedValue={value} onValueChange={onChange} style={{ height: 50 }}>
                      <Picker.Item label="Day" value="" />
                      {days.map((d) => (
                        <Picker.Item key={d} label={d} value={d} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            />
            <Controller
              control={control}
              name="month"
              render={({ field: { onChange, value } }) => (
                <View className="mx-2 flex-1">
                  <View className="border-gray-300 rounded-lg border bg-white">
                    <Picker selectedValue={value} onValueChange={onChange} style={{ height: 50 }}>
                      <Picker.Item label="Month" value="" />
                      {months.map((month) => (
                        <Picker.Item key={month} label={month} value={month} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            />
            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, value } }) => (
                <View className="ml-2 flex-1">
                  <View className="border-gray-300 rounded-lg border bg-white">
                    <Picker selectedValue={value} onValueChange={onChange} style={{ height: 50 }}>
                      <Picker.Item label="Year" value="" />
                      {years.map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            />
          </View>
          {(errors.day || errors.month || errors.year) && (
            <Text className="mt-1 text-red-500">
              {errors.day?.message || errors.month?.message || errors.year?.message}
            </Text>
          )}
        </View>

        <View className=" flex items-center">
          <TouchableOpacity
            className="mt-4 w-3/4  items-center  rounded-full bg-blue p-2"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}>
            <Text className="text-center text-lg font-semibold text-white">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
