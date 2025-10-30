import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
  constructor(private namespace: string = "auth") {}

  async getAccessToken() {
    // Get the access token for the storage
    const token = await AsyncStorage.getItem(`${this.namespace}:token`);
    return token ? JSON.parse(token) : null;
  }

  async setAccessToken(accessToken: string) {
    // Add the access token to the storage
    await AsyncStorage.setItem(
      `${this.namespace}:token`,
      JSON.stringify(accessToken)
    );
  }

  async removeAccessToken() {
    // Remove the access token from the storage
    await AsyncStorage.removeItem(`${this.namespace}:token`);
  }
}

export default AuthStorage;
