import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface ChantBubbleProps {
  text: string;
  visible: boolean;
}

export function ChantBubble({ text, visible }: ChantBubbleProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0, {
      damping: 12,
      stiffness: 200,
    });
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.tail} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    top: -80,
    left: -40,
    zIndex: 50,
  },
  bubble: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 200,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#000",
  },
  text: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
});
