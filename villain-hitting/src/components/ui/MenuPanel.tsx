import React from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";

interface MenuPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function MenuPanel({ children, style }: MenuPanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "rgba(26, 10, 46, 0.9)",
    borderWidth: 3,
    borderColor: "#f1c40f",
    padding: 12,
    margin: 8,
  },
});
