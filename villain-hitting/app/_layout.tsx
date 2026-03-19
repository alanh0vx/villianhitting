import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, Platform } from "react-native";
import "../src/i18n";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.phoneFrame}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1a0a2e" },
            animation: "fade",
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  phoneFrame: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 430 : undefined,
    backgroundColor: "#1a0a2e",
  },
});
