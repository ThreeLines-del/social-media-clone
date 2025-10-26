import { Text, View } from "react-native";

const FeedPage = () => {
  return (
    <View className="flex-1 bg-red-200">
      <View className="border h-24">
        <View className="flex-1">
          <Text>Header</Text>
        </View>

        <View className="flex-row justify-evenly items-center py-1">
          <Text className="text-lg font-semibold">For you</Text>
          <Text className="text-lg font-semibold">Following</Text>
        </View>
      </View>
    </View>
  );
};

export default FeedPage;
