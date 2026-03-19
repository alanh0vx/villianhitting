import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { PixelText } from "../../src/components/ui/PixelText";
import { PixelButton } from "../../src/components/ui/PixelButton";
import { useGameStore } from "../../src/engine/GameState";
import { SPRITES, getClipStyle } from "../../src/engine/SpriteSheet";
import { useCeremonyGuard } from "../../src/hooks/useCeremonyGuard";

export default function VictoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { turn, villainName } = useGameStore();
  const displayName = villainName || "小人";
  useCeremonyGuard("battle");
  const [grannyFrame, setGrannyFrame] = useState(0);

  const titleScale = useSharedValue(0);
  const grannyY = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 6, stiffness: 80 });
    confettiOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    grannyY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 400 }),
        withTiming(0, { duration: 400 })
      ),
      -1, true
    );
  }, []);

  // Cycle victory animation frames
  useEffect(() => {
    const iv = setInterval(() => {
      setGrannyFrame((f) => (f + 1) % SPRITES.grannyVictory.frameCount);
    }, 150);
    return () => clearInterval(iv);
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));
  const grannyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: grannyY.value }],
  }));
  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const grannyClip = getClipStyle(SPRITES.grannyVictory, grannyFrame, 2.5);

  return (
    <View style={styles.container}>
      {/* Confetti */}
      <Animated.View style={[styles.confettiContainer, confettiStyle]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.confetti,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                backgroundColor: ["#f1c40f", "#e74c3c", "#2ecc71", "#3498db", "#9b59b6"][i % 5],
                width: 6 + Math.random() * 8,
                height: 6 + Math.random() * 8,
                transform: [{ rotate: `${Math.random() * 360}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Victory title */}
      <Animated.View style={[styles.titleArea, titleStyle]}>
        <PixelText size="xl" style={styles.title}>{t("victory.title", { name: displayName })}</PixelText>
        <PixelText size="lg" style={styles.subtitle}>{t("victory.celebrate")}</PixelText>
      </Animated.View>

      {/* Happy granny — real sprite */}
      <Animated.View style={[styles.grannyArea, grannyStyle]}>
        <View style={grannyClip.container}>
          <Image
            source={SPRITES.grannyVictory.source}
            style={grannyClip.image}
            resizeMode="stretch"
          />
        </View>
      </Animated.View>

      {/* Stats */}
      <View style={styles.stats}>
        <PixelText size="md">回合數: {turn - 1}</PixelText>
      </View>

      {/* Continue to post-battle ceremony */}
      <View style={styles.actions}>
        <PixelButton
          title={`🙏 ${t("ceremony.tapToContinue")}`}
          onPress={() => router.push("/ceremony/blessing")}
          color="#8e44ad"
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  confetti: {
    position: "absolute",
  },
  titleArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: "#f1c40f",
    fontSize: 40,
  },
  subtitle: {
    color: "#e74c3c",
    marginTop: 8,
  },
  grannyArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  stats: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1c40f",
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    alignItems: "center",
  },
});
