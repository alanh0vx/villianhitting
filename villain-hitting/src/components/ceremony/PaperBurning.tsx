import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { PixelText } from "../ui/PixelText";

export function PaperBurning() {
  const flame1Scale = useSharedValue(1);
  const flame2Scale = useSharedValue(0.8);
  const paperOpacity = useSharedValue(1);
  const paperScale = useSharedValue(1);

  useEffect(() => {
    flame1Scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(0.8, { duration: 300 })
      ),
      -1,
      true
    );
    flame2Scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 400 }),
        withTiming(0.7, { duration: 400 })
      ),
      -1,
      true
    );

    // Paper burns away
    paperOpacity.value = withDelay(
      1000,
      withTiming(0, { duration: 3000 })
    );
    paperScale.value = withDelay(
      1000,
      withTiming(0.3, { duration: 3000 })
    );
  }, []);

  const flame1Style = useAnimatedStyle(() => ({
    transform: [{ scale: flame1Scale.value }],
  }));

  const flame2Style = useAnimatedStyle(() => ({
    transform: [{ scale: flame2Scale.value }],
  }));

  const paperStyle = useAnimatedStyle(() => ({
    opacity: paperOpacity.value,
    transform: [{ scale: paperScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Gold paper */}
      <Animated.View style={[styles.paper, paperStyle]}>
        <View style={styles.goldPaper}>
          <PixelText size="lg" style={{ color: "#8b0000" }}>
            金
          </PixelText>
        </View>
      </Animated.View>

      {/* Flames */}
      <View style={styles.flameContainer}>
        <Animated.View style={[styles.flame, styles.flame1, flame1Style]} />
        <Animated.View style={[styles.flame, styles.flame2, flame2Style]} />
        <Animated.View style={[styles.flame, styles.flame3, flame1Style]} />
      </View>

      {/* Fire base */}
      <View style={styles.fireBase} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 180,
    justifyContent: "flex-end",
  },
  paper: {
    marginBottom: -20,
    zIndex: 2,
  },
  goldPaper: {
    width: 60,
    height: 80,
    backgroundColor: "#f1c40f",
    borderWidth: 2,
    borderColor: "#d4a017",
    alignItems: "center",
    justifyContent: "center",
  },
  flameContainer: {
    flexDirection: "row",
    marginBottom: -10,
    zIndex: 1,
  },
  flame: {
    borderRadius: 0,
  },
  flame1: {
    width: 16,
    height: 30,
    backgroundColor: "#e74c3c",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  flame2: {
    width: 20,
    height: 40,
    backgroundColor: "#f39c12",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 2,
  },
  flame3: {
    width: 14,
    height: 25,
    backgroundColor: "#e67e22",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  fireBase: {
    width: 80,
    height: 20,
    backgroundColor: "#444",
    borderRadius: 4,
  },
});
