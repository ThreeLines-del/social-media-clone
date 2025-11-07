import { FlatList, Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostItem from "../components/PostItem";
import { Post } from "../types/types";
import { Link } from "react-router-native";
import { useQuery } from "@apollo/client/react";
import { ALL_POSTS, CURRENT_USER } from "../graphql/queries";

export const dummyPosts: Post[] = [
  {
    id: "68f0dbb4234e2d56e4afcc48",
    author: {
      id: "68eec12dcc7f7bd8143f37a2",
      username: "codewave",
      name: "Daniel N.",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    content:
      "Just pushed a new update to my GraphQL server 🚀 — pagination is finally working perfectly!",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
    likesCount: 32,
    commentsCount: 5,
    createdAt: "2025-10-27T12:01:39.940Z",
  },
  {
    id: "68f0dbc6234e2d56e4afcc4e",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "dev_jayyyyyyyyyyyyyyyyyyyy",
      name: "Jay Mensah",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    content:
      "Frontend devs, what’s your favorite CSS framework? I’m hooked on Tailwind lately 😎",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=60",
    likesCount: 1756232,
    commentsCount: 9,
    createdAt: "2025-10-20T12:01:39.940Z",
  },
  {
    id: "68f0dbce234e2d56e4afcc53",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "dev_jay",
      name: "Jay Mensah",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    content:
      "Taking a break from coding to appreciate clean UI ✨ — minimal, readable, functional.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
    likesCount: 4000,
    commentsCount: 2,
    createdAt: "2025-10-27T11:49:46.514Z",
  },
  {
    id: "68f0dbe0234e2d56e4afcc62",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "uiqueen",
      name: "Mabel A.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione animi expedita, voluptates non dolor saepe vitae debitis esse obcaecati, earum quas dignissimos corrupti dolorum assumenda error, exercitationem inventore consequatur officia.",
    likesCount: 102,
    commentsCount: 20,
    createdAt: "2025-10-27T20:59:39.940Z",
  },
  {
    id: "68f0dbd3234e2d56e4afcc57",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "dev_jay",
      name: "Jay Mensah",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    content: "GraphQL > REST — change my mind 🤓",
    likesCount: 58,
    commentsCount: 12,
    createdAt: "2025-10-16T11:49:34.411Z",
  },
  {
    id: "68f0dbda234e2d56e4afcc5b",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "dev_jay",
      name: "Jay Mensah",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    content:
      "Finally integrated subscriptions — real-time comments are live! 🥳",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
    likesCount: 87,
    commentsCount: 15,
    createdAt: "2025-10-16T11:49:08.597Z",
  },
  {
    id: "68f0dbe0234e2d56e4afcc61",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "uiqueen",
      name: "Mabel A.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    content:
      "UI design tip: whitespace is not empty space — it’s breathing room for your content 🌿",
    likesCount: 102,
    commentsCount: 20,
    createdAt: "2025-10-16T11:49:26.873Z",
  },
];

const FeedPage = () => {
  const data = useQuery<{ me: { id: string; email: string; avatar: string } }>(
    CURRENT_USER
  );
  const allPosts = useQuery<{
    posts: {
      edges: {
        cursor: string;
        node: {
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
        totalCount: number;
        pageInfo: {
          endCursor: string | null;
          hasNextPage: boolean;
        };
      }[];
    };
  }>(ALL_POSTS, {
    variables: {
      first: 8,
    },
  });

  const postsNodes = allPosts.data?.posts
    ? allPosts.data.posts.edges.map((edge) => edge.node)
    : [];

  return (
    <View className="flex-1 relative">
      <Ionicons
        className="absolute right-0 bottom-0 mb-28 mr-3 z-10"
        size={62}
        name="add-circle"
      />
      <View className="flex-1">
        <FlatList
          data={postsNodes}
          renderItem={({ item }) => <PostItem item={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View className="h-24">
              <View className="flex-1 justify-center items-center flex-row relative">
                <Link
                  className="absolute left-0 ml-2"
                  underlayColor={"transparent"}
                  to={"/login"}
                >
                  {data.data?.me?.avatar ? (
                    <Image
                      className="h-10 w-10 rounded-full"
                      source={{ uri: data.data.me.avatar }}
                    />
                  ) : (
                    <Ionicons name="person-circle" size={30} />
                  )}
                </Link>

                <Ionicons name="paper-plane-outline" size={40} />
              </View>

              <View className="flex-row justify-evenly items-center py-1 border-b border-gray-300">
                <Text className="text-lg font-semibold">For you</Text>
                <Text className="text-lg font-semibold">Following</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default FeedPage;
