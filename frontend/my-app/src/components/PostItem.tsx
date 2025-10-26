import { Text, View } from "react-native";
import { Post } from "../types/types";

interface PostItemProps {
  item: Post;
}

const PostItem = ({ item }: PostItemProps) => {
  return (
    <View className="border">
      <Text>{item.author.name}</Text>
    </View>
  );
};

export default PostItem;
