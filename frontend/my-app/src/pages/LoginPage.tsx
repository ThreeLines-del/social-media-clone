import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link } from "react-router-native";

const LoginPage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  return (
    <View className="flex-1 items-center px-10 gap-10 pt-32">
      <Link
        className="absolute left-0 p-5"
        underlayColor={"transparent"}
        to={"../"}
      >
        <Ionicons name="arrow-back" size={22} />
      </Link>

      <View className="flex flex-col w-full gap-5">
        <View className="flex flex-col gap-10 items-center">
          <Ionicons name="paper-plane-outline" size={40} />
          <Text className="text-3xl font-semibold">Sign in</Text>
        </View>

        <TextInput
          placeholder="username"
          className={`border h-14 rounded-full ${isFocused ? "border-blue-500" : "border-gray-400"}  text-lg px-5`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TextInput
          placeholder="password"
          className={`border h-14 rounded-full ${isFocused2 ? "border-blue-500" : "border-gray-400"} text-lg px-5`}
          onFocus={() => setIsFocused2(true)}
          onBlur={() => setIsFocused2(false)}
        />
        <Pressable className="border h-14 rounded-full justify-center items-center bg-gray-800">
          <Text className="text-lg font-semibold text-white">Login</Text>
        </Pressable>
        <Pressable className="border h-14 rounded-full justify-center items-center">
          <Text className="text-lg font-semibold">Forgot password?</Text>
        </Pressable>
        <Text className="text-lg text-gray-400">
          Don't have an account?{" "}
          <Text className="text-blue-400 font-semibold">Sign up</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;
