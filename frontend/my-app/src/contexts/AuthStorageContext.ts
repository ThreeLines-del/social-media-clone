import { createContext } from "react";

const AuthStorageContext = createContext({
  getAccessToken: async () => {},
  setAccessToken: async (accessToken: string) => {},
});

export default AuthStorageContext;
