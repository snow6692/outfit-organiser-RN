/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isPast,
  isToday,
} from 'date-fns';
import { useGetUserOutfits } from '~/hooks/useOutfitQueries';
import { useGetUserSchedules, useCreateSchedule, useDeleteSchedule } from '~/hooks/useSchedule';

const ScheduleOutfitsScreen: React.FC = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const { data: schedules = [], isLoading: schedulesLoading } = useGetUserSchedules(year, month);
  const { data: outfits = [], isLoading: outfitsLoading } = useGetUserOutfits();
  const { mutate: createSchedule, isPending: createPending } = useCreateSchedule();
  const { mutate: deleteSchedule, isPending: deletePending } = useDeleteSchedule();

  // Sort outfits: favorites first, then by id
  const sortedOutfits = [...outfits].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return a.id.localeCompare(b.id);
  });

  // Generate array of days for the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });
  const monthName = format(currentDate, 'MMMM yyyy');

  // Function to sort images by category: Top > Bottom > Shoes
  const sortImagesByCategory = (images: any[]) => {
    return [...images]
      .sort((a, b) => {
        const categoryOrder: { [key: string]: number } = {
          top: 1,
          bottom: 2,
          shoes: 3,
        };
        const aOrder = categoryOrder[a.Category.name.toLowerCase()] || 99;
        const bOrder = categoryOrder[b.Category.name.toLowerCase()] || 99;
        return aOrder - bOrder;
      })
      .slice(0, 3);
  };

  const handleDayPress = (day: Date) => {
    console.log('Selected day:', day, 'Is past:', isPast(day), 'Is today:', isToday(day));
    // Allow selecting today or future dates
    if (!isPast(day) || isToday(day)) {
      setSelectedDate(day);
      setModalVisible(true);
    } else {
      alert('Cannot select past dates.');
    }
  };

  const handleSelectOutfit = (outfitId: string) => {
    if (!selectedDate) {
      alert('No date selected. Please try again.');
      return;
    }
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    console.log('Scheduling outfit:', { outfitId, date: formattedDate, selectedDate });
    createSchedule(
      { outfitId, date: formattedDate },
      {
        onSuccess: () => setModalVisible(false),
        onError: (error: any) => {
          const zodErrors = error.response?.data?.errors?.date?._errors;
          const errorMessage = zodErrors?.length
            ? `Date error: ${zodErrors.join(', ')}`
            : error.message || 'Failed to create schedule';
          alert(errorMessage);
        },
      }
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteSchedule(scheduleId, {
      onError: (error) => alert(error.message),
    });
  };

  const renderDay = ({ item: day }: { item: Date }) => {
    const schedule = schedules.find((s) => isSameDay(new Date(s.date), day));
    const isTodayDay = isToday(day);
    const isDisabled = isPast(day) && !isTodayDay;
    return (
      <TouchableOpacity
        className={`m-1 flex h-40 w-20 items-center justify-start rounded-lg ${
          schedule ? 'bg-blue-100' : 'bg-gray-100'
        } ${isTodayDay ? 'border-blue-500 border-2' : ''} ${isDisabled ? 'opacity-50' : ''}`}
        onPress={() => handleDayPress(day)}
        disabled={isDisabled}>
        <Text className="mt-2 text-lg font-semibold">{format(day, 'd')}</Text>
        {schedule && (
          <View className="mt-1 flex-col items-center">
            {sortImagesByCategory(schedule.outfit.images).map((image: any) => (
              <Image
                key={image.id}
                source={{ uri: image.url || 'https://via.placeholder.com/30' }}
                className="m-0.5 h-8 w-8 rounded"
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderOutfit = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-gray-100 m-2 flex-row items-center rounded-lg p-2"
      onPress={() => handleSelectOutfit(item.id)}>
      <View className="mr-2 flex-col items-center">
        {sortImagesByCategory(item.images).map((image: any) => (
          <Image
            key={image.id}
            source={{ uri: image.url || 'https://via.placeholder.com/50' }}
            className="m-0.5 h-12 w-12 rounded"
          />
        ))}
      </View>
      <Text className="flex-1 text-base">Outfit #{item.id.slice(0, 4)}</Text>
      {item.favorite && <Ionicons name="heart" size={20} color="red" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Tabs */}
      {/* <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row">
          <Link href="/profile" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Wardrobe</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/wishlist" asChild>
            <TouchableOpacity>
              <Text className="mx-3 text-lg text-gray-500">Wishlist</Text>
            </TouchableOpacity>
          </Link>
          <Text className="mx-3 border-b-2 border-black text-lg font-semibold text-black">
            Schedule Outfits
          </Text>
        </View>
        <Ionicons name="heart-outline" size={24} color="black" />
      </View> */}

      {/* Calendar Navigation */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => setCurrentDate(subMonths(currentDate, 1))}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">{monthName}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, 1))}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      {schedulesLoading || outfitsLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={daysInMonth}
          renderItem={renderDay}
          keyExtractor={(item) => item.toISOString()}
          numColumns={4}
          className="flex-1 px-4"
        />
      )}

      {/* Outfit Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50">
          <View className="mt-auto h-3/4 rounded-t-2xl bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold">
                Select Outfit for {selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {selectedDate && schedules.find((s) => isSameDay(new Date(s.date), selectedDate)) && (
              <TouchableOpacity
                className="my-2 rounded-lg bg-red-500 p-2"
                onPress={() => {
                  const schedule = schedules.find((s) => isSameDay(new Date(s.date), selectedDate));
                  if (schedule) handleDeleteSchedule(schedule.id);
                }}
                disabled={deletePending}>
                <Text className="text-center text-white">
                  {deletePending ? 'Deleting...' : 'Remove Schedule'}
                </Text>
              </TouchableOpacity>
            )}
            <FlatList
              data={sortedOutfits}
              renderItem={renderOutfit}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text className="text-gray-500 text-center">No outfits available</Text>
              }
            />
            {createPending && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ScheduleOutfitsScreen;
