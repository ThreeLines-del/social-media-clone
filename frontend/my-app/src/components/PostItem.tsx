import { Image, Text, View } from "react-native";
import { Post } from "../types/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatCount } from "../utils/formatCount";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface PostItemProps {
  item: Post;
}

const PostItem = ({ item }: PostItemProps) => {
  return (
    <View className="border-b border-gray-300 flex-row min-h-32">
      <View className="w-24 items-center pt-3">
        <Image
          className="h-16 w-16 rounded-full"
          source={{ uri: item.author.avatar }}
        />
      </View>
      <View className="w-full py-3 flex-shrink">
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
        <View className="mt-3 flex flex-row gap-5">
          <View className="flex flex-row justify-center items-center gap-1">
            <View>
              <FontAwesome name="comment-o" size={16} color={"gray"} />
            </View>
            <Text className="text-gray-500">
              {formatCount(item.commentsCount)}
            </Text>
          </View>

          <View className="flex flex-row justify-center items-center gap-1">
            <View>
              <FontAwesome name="heart-o" size={16} color={"gray"} />
            </View>
            <Text className="text-gray-500">
              {formatCount(item.likesCount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostItem;
