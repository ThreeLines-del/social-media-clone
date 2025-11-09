import { Image, Text, View } from "react-native";
import { CommentType, Post } from "../types/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface CommentProps {
  item: CommentType;
}

const Comment = ({ item }: CommentProps) => {
  return (
    <View className="border-b border-gray-300 flex-row min-h-20">
      <View className="w-16 items-center pt-2">
        <Image
          className="h-10 w-10 rounded-full"
          source={{ uri: item.author.avatar }}
        />
      </View>
      <View className="w-full py-2 flex-shrink">
        <View className="flex-1">
          <View className="flex flex-row gap-[1px] items-center">
            <Text
              className="text-lg font-semibold max-w-[120px]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.author.name}
            </Text>
            <Ionicons name="checkmark-circle" size={16} color={"blue"} />
            <Text
              className="font-normal text-gray-500 text-lg max-w-[100px]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              @{item.author.username}
            </Text>
            <Text>•</Text>
            <Text className="text-gray-500">
              {dayjs(item.createdAt).fromNow()}
            </Text>
          </View>
          <Text className="text-lg">{item.content}</Text>
        </View>
      </View>
    </View>
  );
};

export default Comment;
