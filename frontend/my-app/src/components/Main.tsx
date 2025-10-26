import { View } from "react-native";
import FeedPage from "../pages/FeedPage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "./BottomNavBar";
import { Navigate, Route, Routes } from "react-router-native";
import SearchPage from "../pages/SearchPage";

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
        <Route path="/" element={<FeedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <BottomNavBar />
    </View>
  );
};

export default Main;
