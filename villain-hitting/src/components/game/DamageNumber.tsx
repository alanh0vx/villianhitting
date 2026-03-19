import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";

interface DamageNumberProps {
  damage: number;
  isCrit: boolean;
  onComplete?: () => void;
}

export function DamageNumber({ damage, isCrit, onComplete }: DamageNumberProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(isCrit ? 1.5 : 1);

  useEffect(() => {
    translateY.value = withTiming(-80, { duration: 800 });
    opacity.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 400 })
    );
    scale.value = withSequence(
      withTiming(isCrit ? 2 : 1.3, { duration: 200 }),
      withTiming(1, { duration: 600 })
    );

    if (onComplete) {
      const timer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (damage === 0) return null;

  return (
    <Animated.Text
      style={[
        styles.text,
        isCrit && styles.crit,
        animStyle,
      ]}
    >
      -{damage}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    position: "absolute",
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff6b6b",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 100,
  },
  crit: {
    fontSize: 48,
    color: "#f1c40f",
  },
});
