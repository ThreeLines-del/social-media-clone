import { createContext } from "react";

const AuthStorageContext = createContext({
  getAccessToken: async () => {},
  setAccessToken: async (accessToken: string) => {},
  removeAccessToken: async () => {},
});

export default AuthStorageContext;
