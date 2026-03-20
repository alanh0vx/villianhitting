import React from "react";
import { Text, StyleSheet, type TextStyle } from "react-native";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const baseSize = SIZES[size];
  const fontSize = i18n.language === "en" ? Math.round(baseSize * 0.9) : baseSize;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.text,
        { fontSize },
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
