/* eslint-disable prettier/prettier */
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const AuthScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-start gap-20 bg-gray-400 ">
      <Text className="mt-5 text-2xl font-bold text-slate-700">STYLISH</Text>

      {/* Image with Border */}
      <Image
        source={require('../../assets/auth.png')}
        className="mt-5 h-48 w-[90%] rounded-lg border-2 "
        resizeMode="cover"
      />

      {/* Text Section */}
      <View className="mt-5 items-center">
        <Text className="text-lg font-semibold text-soft-white">Hello!</Text>
        <Text className="mt-2 text-center text-2xl font-bold text-soft-white">
          Create your account{'\n'} Have one? Signin!
        </Text>
        <Text className="mt-5 text-lg font-semibold text-soft-white">Get Started </Text>
      </View>

      {/* Buttons */}
      <View className="mt-5 w-[40%]">
        <TouchableOpacity
          className="mb-3 rounded-lg bg-slate-700 py-3"
          onPress={() => router.push('/register')}>
          <Text className="text-center text-lg font-semibold text-soft-white">Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg bg-slate-700 py-3"
          onPress={() => router.push('/login')}>
          <Text className="text-center text-lg font-semibold text-soft-white">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
