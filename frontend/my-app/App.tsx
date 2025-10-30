import "./global.css";
import Main from "./src/components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeRouter } from "react-router-native";
import createApolloClient from "./src/utils/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import AuthStorageContext from "./src/contexts/AuthStorageContext";
import AuthStorage from "./src/utils/authStorage";

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeRouter>
        <ApolloProvider client={apolloClient}>
          <AuthStorageContext.Provider value={authStorage}>
            <Main />
            <StatusBar style="auto" />
          </AuthStorageContext.Provider>
        </ApolloProvider>
      </NativeRouter>
    </SafeAreaProvider>
  );
}
