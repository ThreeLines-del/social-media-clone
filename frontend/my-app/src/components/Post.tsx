import { useQuery } from "@apollo/client/react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { Link, useParams } from "react-router-native";
import { COMMENTS, POST } from "../graphql/queries";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatCount } from "../utils/formatCount";
import Comment from "./Comment";
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

  const allComments = useQuery<{
    comments: {
      edges: {
        node: {
          content: string;
          id: string;
          createdAt: string;
          author: {
            id: string;
            avatar: string;
            username: string;
            name: string;
          };
        };
        cursor: string;
      }[];
      totalCount: number | null;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  }>(COMMENTS, {
    variables: {
      postId: post?.id,
      first: 10,
    },
  });

  const commentNodes = allComments.data?.comments
    ? allComments.data.comments.edges.map((edge) => edge.node)
    : [];

  return (
    <View className="flex-1">
      <View className="h-10 flex-row justify-between items-center px-3">
        <Link to={"../"} underlayColor={"transparent"}>
          <Ionicons name="arrow-back" size={20} />
        </Link>

        <Text className="text-xl font-semibold">Post</Text>
        <Ionicons name="ellipsis-horizontal" size={20} />
      </View>

      {result.loading ? (
        <ActivityIndicator size={50} />
      ) : (
        <View className="flex-1">
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
          <View className="flex-1">
            {allComments.loading && <ActivityIndicator size={50} />}
            {allComments.data?.comments.edges.length === 0 ? (
              <View className="py-2 justify-center items-center">
                <Text className="text-gray-600 font-semibold">no comments</Text>
              </View>
            ) : (
              <FlatList
                data={commentNodes}
                renderItem={({ item }) => <Comment item={item} />}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Post;
