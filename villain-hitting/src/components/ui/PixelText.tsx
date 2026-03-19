import React from "react";
import { Text, StyleSheet, type TextStyle } from "react-native";

interface PixelTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  size?: "sm" | "md" | "lg" | "xl";
  numberOfLines?: number;
}

const SIZES = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 36,
};

export function PixelText({ children, style, size = "md", numberOfLines }: PixelTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.text,
        { fontSize: SIZES[size] },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    letterSpacing: 1,
  },
});
