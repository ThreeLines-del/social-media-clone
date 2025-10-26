import { View } from "react-native";
import FeedPage from "../pages/FeedPage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomNavBar from "./BottomNavBar";
import { Navigate, Route, Routes } from "react-router-native";

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
      </Routes>
      <BottomNavBar />
    </View>
  );
};

export default Main;
