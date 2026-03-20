import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { PixelText } from "../ui/PixelText";

interface DivinationBlocksProps {
  onResult: (result: "holy" | "laugh" | "angry") => void;
}

export function DivinationBlocks({ onResult }: DivinationBlocksProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<"holy" | "laugh" | "angry" | null>(null);
  const [isTossing, setIsTossing] = useState(false);

  const block1Rot = useSharedValue(0);
  const block2Rot = useSharedValue(0);
  const block1Y = useSharedValue(0);
  const block2Y = useSharedValue(0);

  const toss = () => {
    if (isTossing) return;
    setIsTossing(true);
    setResult(null);

    // Animate blocks tossing
    block1Y.value = withSequence(
      withTiming(-100, { duration: 400, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 300, easing: Easing.bounce })
    );
    block2Y.value = withSequence(
      withTiming(-120, { duration: 450, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 350, easing: Easing.bounce })
    );
    block1Rot.value = withSequence(
      withTiming(720, { duration: 700 }),
      withTiming(720, { duration: 0 })
    );
    block2Rot.value = withSequence(
      withTiming(-540, { duration: 750 }),
      withTiming(-540, { duration: 0 })
    );

    setTimeout(() => {
      // 聖杯 (one flat, one curved) = 50% chance
      // 笑杯 (both curved up) = 25%
      // 陰杯 (both flat) = 25%
      const roll = Math.random();
      let res: "holy" | "laugh" | "angry";
      if (roll < 0.5) res = "holy";
      else if (roll < 0.75) res = "laugh";
      else res = "angry";

      setResult(res);
      setIsTossing(false);

      setTimeout(() => onResult(res), 1500);
    }, 800);
  };

  const block1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: block1Y.value },
      { rotate: `${block1Rot.value}deg` },
    ],
  }));

  const block2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: block2Y.value },
      { rotate: `${block2Rot.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <PixelText size="lg" style={{ marginBottom: 20 }}>
        {t("ceremony.divination")}
      </PixelText>

      <View style={styles.blocksRow}>
        <Animated.View style={[styles.block, block1Style]}>
          <View
            style={[
              styles.blockInner,
              result === "holy" || result === "angry"
                ? styles.blockFlat
                : styles.blockCurved,
            ]}
          />
        </Animated.View>
        <Animated.View style={[styles.block, block2Style]}>
          <View
            style={[
              styles.blockInner,
              result === "holy" || result === "laugh"
                ? styles.blockCurved
                : styles.blockFlat,
            ]}
          />
        </Animated.View>
      </View>

      {result && (
        <PixelText
          size="lg"
          style={{
            marginTop: 20,
            color: result === "holy" ? "#f1c40f" : "#e74c3c",
          }}
        >
          {result === "holy"
            ? t("victory.holyBlocks")
            : result === "laugh"
            ? t("victory.laughBlocks")
            : t("victory.angryBlocks")}
        </PixelText>
      )}

      <Pressable onPress={toss} disabled={isTossing} style={styles.tossArea}>
        <PixelText>{isTossing ? "..." : t("ui.tossBlocks")}</PixelText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  blocksRow: {
    flexDirection: "row",
    gap: 40,
  },
  block: {
    width: 40,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  blockInner: {
    width: 36,
    height: 56,
    borderRadius: 18,
  },
  blockFlat: {
    backgroundColor: "#8b4513",
    borderWidth: 2,
    borderColor: "#5d2e0a",
  },
  blockCurved: {
    backgroundColor: "#d4a574",
    borderWidth: 2,
    borderColor: "#8b4513",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  tossArea: {
    marginTop: 30,
    padding: 16,
    borderWidth: 2,
    borderColor: "#f1c40f",
    backgroundColor: "rgba(241, 196, 15, 0.1)",
  },
});
