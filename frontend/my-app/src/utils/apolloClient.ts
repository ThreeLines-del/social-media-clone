import { InMemoryCache } from "@apollo/client";
import { ApolloClient, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import Constants from "expo-constants";
import AuthStorage from "./authStorage";

const apolloUri = Constants.expoConfig?.extra?.apolloUri;
const httpLink = new HttpLink({ uri: apolloUri });

const createApolloClient = (authStorage: AuthStorage) => {
  const authLink = new SetContextLink(async (prevContext, operation) => {
    const accessToken = await authStorage.getAccessToken();

    return {
      headers: {
        ...prevContext.headers,
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
