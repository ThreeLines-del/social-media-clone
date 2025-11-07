import { View } from "react-native";
import FeedPage from "../pages/FeedPage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigate, Route, Routes } from "react-router-native";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../pages/MainLayout";
import Post from "./Post";

const Main = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
      }}
      className="bg-white"
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FeedPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="post/:id" element={<Post />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </View>
  );
};

export default Main;
