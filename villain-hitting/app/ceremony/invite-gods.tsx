import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelText } from "../../src/components/ui/PixelText";
import { IncenseAnimation } from "../../src/components/ceremony/IncenseAnimation";
import { useGameStore } from "../../src/engine/GameState";
import { SPRITES, getClipStyle } from "../../src/engine/SpriteSheet";
import { useCeremonyGuard } from "../../src/hooks/useCeremonyGuard";

type PreBattlePhase = "invite" | "declare";

export default function InviteGodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const setCeremonyStep = useGameStore((s) => s.setCeremonyStep);
  const { grannyStamina, grannyMaxStamina } = useGameStore();
  useCeremonyGuard("title");
  const [phase, setPhase] = useState<PreBattlePhase>("invite");
  const [ready, setReady] = useState(false);
  const [grannyFrame, setGrannyFrame] = useState(0);

  const titleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const promptOpacity = useSharedValue(0);
  const grannyBounce = useSharedValue(0);

  const startAnimations = (delay = 0) => {
    titleOpacity.value = 0;
    descOpacity.value = 0;
    promptOpacity.value = 0;
    titleOpacity.value = withDelay(delay, withTiming(1, { duration: 1000 }));
    descOpacity.value = withDelay(delay + 1200, withTiming(1, { duration: 800 }));
    promptOpacity.value = withDelay(delay + 3500, withTiming(1, { duration: 600 }));
  };

  useEffect(() => {
    setCeremonyStep("invite-gods");
    startAnimations();
    grannyBounce.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    const timer = setTimeout(() => setReady(true), 4100);
    return () => clearTimeout(timer);
  }, []);

  // Idle animation frame cycling
  useEffect(() => {
    const iv = setInterval(() => {
      setGrannyFrame((f) => (f + 1) % SPRITES.grannyIdle.frameCount);
    }, 200);
    return () => clearInterval(iv);
  }, []);

  const handleTap = () => {
    if (!ready) return;

    if (phase === "invite") {
      setPhase("declare");
      setReady(false);
      startAnimations(200);
      setTimeout(() => setReady(true), 4300);
    } else {
      router.push("/ceremony/create-villain");
    }
  };

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const descStyle = useAnimatedStyle(() => ({ opacity: descOpacity.value }));
  const promptStyle = useAnimatedStyle(() => ({ opacity: promptOpacity.value }));
  const grannyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: grannyBounce.value }],
  }));

  const sceneSource =
    phase === "invite" ? SPRITES.sceneInvite.source : SPRITES.sceneDeclare.source;

  const stepLabel =
    phase === "invite"
      ? `① ${t("ceremony.inviteGods")}`
      : `② ${t("ceremony.declaration")}`;

  const titleText =
    phase === "invite" ? t("ceremony.inviteGods") : t("ceremony.declaration");

  const descText =
    phase === "invite"
      ? t("ceremony.inviteGodsDesc")
      : t("ceremony.declarationDesc");

  const grannyClip = getClipStyle(SPRITES.grannyIdle, grannyFrame, 2.5);
  const staminaPct = (grannyStamina / grannyMaxStamina) * 100;

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      {/* Scene illustration as background */}
      <Image
        source={sceneSource}
        style={styles.sceneBg}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Step indicator */}
      <View style={[styles.stepBadge, { top: Math.max(insets.top, 8) + 4 }]}>
        <PixelText size="sm" style={{ color: "#f1c40f" }}>
          {stepLabel}
        </PixelText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Text bubble */}
        <Animated.View style={[styles.textBubble, titleStyle]}>
          <PixelText size="xl" style={styles.title}>
            {titleText}
          </PixelText>
        </Animated.View>

        {phase === "invite" && <IncenseAnimation />}

        <Animated.View style={[styles.textBubble, descStyle]}>
          <PixelText size="md" style={styles.desc}>
            {descText}
          </PixelText>
        </Animated.View>

        {/* Granny sprite with stamina */}
        <View style={styles.grannySection}>
          <Animated.View style={grannyStyle}>
            <View style={grannyClip.container}>
              <Image
                source={SPRITES.grannyIdle.source}
                style={grannyClip.image}
                resizeMode="stretch"
              />
            </View>
          </Animated.View>

          {/* Stamina bar */}
          <View style={styles.staminaContainer}>
            <View style={styles.staminaLabelRow}>
              <PixelText size="sm" style={{ color: "#f1c40f" }}>
                {t("ceremony.grannyStamina")}
              </PixelText>
              <PixelText size="sm" style={{ color: "#fff" }}>
                {grannyStamina} / {grannyMaxStamina}
              </PixelText>
            </View>
            <View style={styles.staminaBarBg}>
              <View style={[styles.staminaBarFill, { width: `${staminaPct}%` }]} />
            </View>
          </View>
        </View>
      </View>

      <Animated.View style={[styles.prompt, promptStyle, { bottom: Math.max(insets.bottom, 20) + 12 }]}>
        <PixelText size="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
          {t("ceremony.tapToContinue")}
        </PixelText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
  },
  sceneBg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 10, 46, 0.4)",
  },
  stepBadge: {
    position: "absolute",
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#f1c40f",
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  textBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderWidth: 2,
    borderColor: "#f1c40f",
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: "90%",
  },
  title: {
    color: "#f1c40f",
    textAlign: "center",
  },
  desc: {
    color: "#ddd",
    textAlign: "center",
  },
  grannySection: {
    alignItems: "center",
    gap: 8,
  },
  staminaContainer: {
    width: 180,
  },
  staminaLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  staminaBarBg: {
    height: 16,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#f1c40f",
    overflow: "hidden",
  },
  staminaBarFill: {
    height: "100%",
    backgroundColor: "#2ecc71",
  },
  prompt: {
    position: "absolute",
    alignSelf: "center",
  },
});
