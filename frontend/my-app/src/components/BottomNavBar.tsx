import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocation } from "react-router-native";

function NavIcon({
  to,
  active,
  inactive,
}: {
  to: string;
  active: any;
  inactive: string;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} underlayColor="transparent">
      <Ionicons
        name={isActive ? active : inactive}
        size={28}
        color={isActive ? "blue" : "gray"}
      />
    </Link>
  );
}

const BottomNavBar = () => {
  return (
    <View className="bg-white h-24 absolute bottom-0 right-0 left-0">
      <View className="flex-row h-full justify-around pt-2 border-t border-gray-300">
        <View className="w-10 h-10 justify-center items-center">
          <NavIcon to={"/"} active={"home"} inactive={"home-outline"} />
        </View>

        <View className="w-10 h-10 justify-center items-center">
          <NavIcon
            to={"/search"}
            active={"search"}
            inactive={"search-outline"}
          />
        </View>

        <View className="w-10 h-10 justify-center items-center">
          <NavIcon
            to={""}
            active={"notifications"}
            inactive={"notifications-outline"}
          />
        </View>

        <View className="w-10 h-10 justify-center items-center">
          <NavIcon to={""} active={"mail"} inactive={"mail-outline"} />
        </View>
      </View>
    </View>
  );
};

export default BottomNavBar;
