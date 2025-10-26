import "./global.css";
import Main from "./src/components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeRouter } from "react-router-native";

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeRouter>
        <Main />
        <StatusBar style="auto" />
      </NativeRouter>
    </SafeAreaProvider>
  );
}
