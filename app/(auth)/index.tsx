/* eslint-disable prettier/prettier */
import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const AuthScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-start gap-20 bg-white pt-20 ">
      {/* Image with Border */}
      <Image
        source={require('../../assets/auth.png')}
        className="mt-5 h-48 w-[90%] rounded-lg "
        resizeMode="cover"
      />

      {/* Text Section */}
      <View className="mt-5 items-center">
        <Text className="text-4xl font-bold ">Hello!</Text>
        <Text className="text-gray mt-2 text-center text-2xl font-semibold">
          Create your account{'\n'} Have one? Signin!
        </Text>
      </View>

      {/* Buttons */}
      <View className="mt-5 w-[40%] gap-y-5">
        <TouchableOpacity
          className="bg-blue mb-3 rounded-lg bg-blue-500 py-3"
          onPress={() => router.push('/register')}>
          <Text className="text-center text-lg font-semibold text-white ">Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-blue  rounded-lg border py-3"
          onPress={() => router.push('/login')}>
          <Text className="text-blue text-center text-lg font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
