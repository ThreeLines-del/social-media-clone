import { View } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import { Outlet } from "react-router-native";

const MainLayout = () => {
  return (
    <View className="flex-1">
      <Outlet />
      <BottomNavBar />
    </View>
  );
};

export default MainLayout;
