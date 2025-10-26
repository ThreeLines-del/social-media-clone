import { FlatList, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostItem from "../components/PostItem";
import { Post } from "../types/types";

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
  },
  {
    id: "68f0dbc6234e2d56e4afcc4e",
    author: {
      id: "68eef4292022f7a6a032ed90",
      username: "dev_jay",
      name: "Jay Mensah",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    content:
      "Frontend devs, what’s your favorite CSS framework? I’m hooked on Tailwind lately 😎",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=60",
    likesCount: 17,
    commentsCount: 9,
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
    likesCount: 40,
    commentsCount: 2,
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
  },
];

const FeedPage = () => {
  return (
    <View className="flex-1">
      <View className="h-24">
        <View className="flex-1 justify-center items-center flex-row relative">
          <Ionicons
            name="person-circle"
            size={30}
            className="absolute left-0 ml-2"
          />
          <Ionicons name="paper-plane-outline" size={40} />
        </View>

        <View className="flex-row justify-evenly items-center py-1 border-b border-gray-300">
          <Text className="text-lg font-semibold">For you</Text>
          <Text className="text-lg font-semibold">Following</Text>
        </View>
      </View>
      <View className="bg-slate-100 flex-1">
        <FlatList
          data={dummyPosts}
          renderItem={({ item }) => <PostItem item={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default FeedPage;
