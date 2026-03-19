import React from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import { PixelText } from "./PixelText";

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  size?: "sm" | "md" | "lg";
}

export function PixelButton({
  title,
  onPress,
  color = "#e74c3c",
  disabled = false,
  style,
  size = "md",
}: PixelButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? "#555" : color,
          transform: [{ scale: pressed ? 0.95 : 1 }],
          opacity: disabled ? 0.5 : 1,
        },
        size === "sm" && styles.sm,
        size === "lg" && styles.lg,
        style,
      ]}
    >
      <PixelText size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}>
        {title}
      </PixelText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 3,
    borderTopColor: "rgba(255,255,255,0.3)",
    borderLeftColor: "rgba(255,255,255,0.3)",
    borderBottomColor: "rgba(0,0,0,0.5)",
    borderRightColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  sm: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 60,
  },
  lg: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    minWidth: 160,
  },
});
