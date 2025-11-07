import { useQuery } from "@apollo/client/react";
import { FlatList, Image, Text, View } from "react-native";
import { useParams } from "react-router-native";
import { POST } from "../graphql/queries";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatCount } from "../utils/formatCount";
dayjs.extend(relativeTime);

const Post = () => {
  const { id } = useParams();

  const result = useQuery<{
    post: {
      author: {
        avatar: string;
        id: string;
        name: string;
        username: string;
      };
      id: string;
      content: string;
      likesCount: number;
      commentsCount: number;
      image: string;
      createdAt: string;
    };
  }>(POST, {
    variables: {
      postId: id,
    },
  });

  const post = result.data ? result.data.post : null;

  return (
    <View className="flex-1">
      <View className="h-10 flex-row justify-between items-center px-3">
        <Ionicons name="arrow-back" size={20} />
        <Text className="text-xl font-semibold">Post</Text>
        <Ionicons name="ellipsis-horizontal" size={20} />
      </View>
      <View className="border-b border-gray-300">
        <View className="flex-row px-2 gap-2 items-center h-16">
          <Image
            className="h-10 w-10 rounded-full"
            source={{ uri: post?.author.avatar }}
          />
          <View className="">
            <Text
              className="text-lg font-semibold max-w-[120px]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {post?.author.name}
              <Ionicons name="checkmark-circle" size={16} color={"blue"} />
            </Text>

            <Text
              className="font-normal text-gray-500 max-w-[100px] leading-4"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              @{post?.author.username}
            </Text>
          </View>
        </View>
        <View className="w-full flex-shrink min-h-36 px-2 py-1">
          <View className="flex-1">
            <Text className="text-lg">{post?.content}</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-sm">
              {dayjs(post?.createdAt).format("h:mm A DD/MM/YY")}
            </Text>
          </View>
          <View className="mt-3 flex flex-row gap-5">
            <View className="flex flex-row justify-center items-center gap-1">
              <View>
                <FontAwesome name="comment-o" size={20} color={"gray"} />
              </View>
              <Text className="text-gray-500">
                {formatCount(post?.commentsCount ?? 0)}
              </Text>
            </View>
            <View className="flex flex-row justify-center items-center gap-1">
              <View>
                <FontAwesome name="heart-o" size={20} color={"gray"} />
              </View>
              <Text className="text-gray-500">
                {formatCount(post?.likesCount ?? 0)}
              </Text>
            </View>
          </View>
          <View className="py-3">
            <Text className="text-gray-600 font-semibold">comments</Text>
          </View>
        </View>
      </View>
      <View className="flex-1 bg-yellow-300">
        {/* <FlatList data={}  /> */}
      </View>
    </View>
  );
};

export default Post;
