import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const Main = () => {
  return (
    <View>
      <Text style={styles.textColor}>
        Open up App.tsx to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  textColor: {
    color: "red",
  },
});

export default Main;
