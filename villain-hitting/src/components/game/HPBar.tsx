import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { PixelText } from "../ui/PixelText";

interface HPBarProps {
  hp: number;
  maxHp: number;
  label?: string;
}

export function HPBar({ hp, maxHp, label }: HPBarProps) {
  const widthAnim = useSharedValue(100);
  const shakeX = useSharedValue(0);

  const pct = Math.max(0, (hp / maxHp) * 100);

  useEffect(() => {
    // Shake on damage
    shakeX.value = withSequence(
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(-2, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    widthAnim.value = withTiming(pct, { duration: 400 });
  }, [hp]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value}%` as `${number}%`,
    backgroundColor:
      widthAnim.value > 60 ? "#2ecc71" : widthAnim.value > 30 ? "#f39c12" : "#e74c3c",
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <PixelText size="sm">{label || "氣數"}</PixelText>
        <PixelText size="sm">
          {hp} / {maxHp}
        </PixelText>
      </View>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, barStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barBg: {
    height: 20,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#f1c40f",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
  },
});
