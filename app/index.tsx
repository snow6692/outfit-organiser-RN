/* eslint-disable prettier/prettier */
import { useRouter } from 'expo-router';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';

const SplashScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ImageBackground
        source={require('../assets/splash.jpg')} // Use require for local images
        className="flex-1 items-center justify-between"
        resizeMode="cover">
        <View className="mt-10">
          <Text className="text-4xl font-bold text-slate-700">STYLISH</Text>
        </View>

        <TouchableOpacity
          className="mb-10 rounded-full bg-gray-500 px-10 py-3"
          onPress={() => router.push('/auth')}>
          <Text className="text-lg font-semibold text-white">Get Saturated</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;
