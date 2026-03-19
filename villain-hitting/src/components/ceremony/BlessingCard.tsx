import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { BLESSINGS } from "../../data/blessings";
import { PixelText } from "../ui/PixelText";

export function BlessingCard() {
  const { t } = useTranslation();
  const [blessing] = useState(
    () => BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)]
  );

  const scale = useSharedValue(0);
  const rotation = useSharedValue(-10);

  useEffect(() => {
    scale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    rotation.value = withDelay(300, withSpring(0, { damping: 12 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <View style={styles.inner}>
        <PixelText size="xl">{blessing.emoji}</PixelText>
        <PixelText size="lg" style={styles.blessingText}>
          {t(blessing.i18nKey)}
        </PixelText>
        <View style={styles.ornament}>
          <PixelText size="sm" style={{ color: "#f1c40f" }}>
            ✦ 神婆賜福 ✦
          </PixelText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 280,
    backgroundColor: "#8b0000",
    borderWidth: 4,
    borderColor: "#f1c40f",
    padding: 4,
    alignSelf: "center",
  },
  inner: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#f1c40f",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },
  blessingText: {
    color: "#f1c40f",
    textAlign: "center",
  },
  ornament: {
    position: "absolute",
    bottom: 16,
  },
});
