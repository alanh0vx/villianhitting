import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function IncenseAnimation() {
  const smoke1Y = useSharedValue(0);
  const smoke1X = useSharedValue(0);
  const smoke1Opacity = useSharedValue(0.6);
  const smoke2Y = useSharedValue(0);
  const smoke2X = useSharedValue(0);
  const smoke2Opacity = useSharedValue(0.4);

  useEffect(() => {
    smoke1Y.value = withRepeat(
      withTiming(-60, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    smoke1X.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1000 }),
        withTiming(-8, { duration: 1000 })
      ),
      -1,
      true
    );
    smoke1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );

    smoke2Y.value = withRepeat(
      withTiming(-50, { duration: 2500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    smoke2X.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200 }),
        withTiming(6, { duration: 1300 })
      ),
      -1,
      true
    );
    smoke2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 600 }),
        withTiming(0, { duration: 1900 })
      ),
      -1,
      false
    );
  }, []);

  const smoke1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: smoke1Y.value }, { translateX: smoke1X.value }],
    opacity: smoke1Opacity.value,
  }));

  const smoke2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: smoke2Y.value }, { translateX: smoke2X.value }],
    opacity: smoke2Opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Incense sticks */}
      <View style={styles.incenseHolder}>
        <View style={styles.stick} />
        <View style={[styles.stick, { marginLeft: 6 }]} />
        <View style={[styles.stick, { marginLeft: 6 }]} />
      </View>

      {/* Smoke particles */}
      <Animated.View style={[styles.smoke, smoke1Style]} />
      <Animated.View style={[styles.smoke, styles.smoke2, smoke2Style]} />

      {/* Incense pot */}
      <View style={styles.pot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 100,
    justifyContent: "flex-end",
  },
  incenseHolder: {
    flexDirection: "row",
    marginBottom: -4,
  },
  stick: {
    width: 3,
    height: 40,
    backgroundColor: "#e74c3c",
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  smoke: {
    position: "absolute",
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(200, 200, 200, 0.6)",
  },
  smoke2: {
    left: "55%",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pot: {
    width: 36,
    height: 20,
    backgroundColor: "#8b4513",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
