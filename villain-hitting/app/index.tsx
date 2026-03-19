import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { PixelText } from "../src/components/ui/PixelText";
import { PixelButton } from "../src/components/ui/PixelButton";
import { useGameStore } from "../src/engine/GameState";
import { SPRITES, getClipStyle } from "../src/engine/SpriteSheet";

export default function TitleScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const reset = useGameStore((s) => s.reset);
  const [grannyFrame, setGrannyFrame] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const titleScale = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const grannyBounce = useSharedValue(0);
  const sandalRotate = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    grannyBounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );
    sandalRotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 300 }),
        withTiming(15, { duration: 300 })
      ),
      -1, true
    );
  }, []);

  // Idle animation frame cycling
  useEffect(() => {
    const iv = setInterval(() => setGrannyFrame((f) => (f + 1) % 4), 250);
    return () => clearInterval(iv);
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));
  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));
  const grannyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: grannyBounce.value }],
  }));
  const sandalStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sandalRotate.value}deg` }],
  }));

  const handleStart = () => {
    reset();
    router.push("/ceremony/invite-gods");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "zh-HK" ? "en" : "zh-HK");
  };

  const grannyClip = getClipStyle(SPRITES.grannyIdle, grannyFrame, 2);
  const sandalClip = getClipStyle(SPRITES.weaponsIcons, 0, 1.5);

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image source={SPRITES.bgTitle.source} style={styles.bgImage} resizeMode="cover" />
      <View style={styles.bgOverlay} />

      {/* Title */}
      <View style={styles.titleArea}>
        <Animated.View style={titleStyle}>
          <PixelText size="xl" style={styles.title}>{t("app.title")}</PixelText>
        </Animated.View>
        <Animated.View style={subtitleStyle}>
          <PixelText size="md" style={styles.subtitle}>{t("app.subtitle")}</PixelText>
        </Animated.View>
      </View>

      {/* Granny character with sprite */}
      <View style={styles.grannyRow}>
        <Animated.View style={grannyStyle}>
          <View style={grannyClip.container}>
            <Image source={SPRITES.grannyIdle.source} style={grannyClip.image} resizeMode="stretch" />
          </View>
        </Animated.View>
        <Animated.View style={[styles.sandalFloat, sandalStyle]}>
          <View style={sandalClip.container}>
            <Image source={SPRITES.weaponsIcons.source} style={sandalClip.image} resizeMode="stretch" />
          </View>
        </Animated.View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <PixelButton title={t("app.start")} onPress={handleStart} color="#e74c3c" size="lg" />
        <PixelButton title={`📖 ${t("app.tutorial")}`} onPress={() => setShowTutorial(true)} color="#3498db" size="sm" />
        <Pressable onPress={toggleLanguage} style={styles.langButton}>
          <PixelText size="sm">🌐 {i18n.language === "zh-HK" ? "English" : "廣東話"}</PixelText>
        </Pressable>
      </View>

      {/* Tutorial Modal */}
      <Modal visible={showTutorial} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <PixelText size="lg" style={styles.modalTitle}>{t("tutorial.title")}</PixelText>

              <PixelText size="sm" style={styles.modalSubtitle}>
                {i18n.language === "zh-HK"
                  ? "打小人係香港鵝頸橋底嘅傳統民間習俗。相傳驚蟄當日百蟲初醒，人們會請神婆以拖鞋拍打紙小人，將惡運、小人統統打走，祈求神明庇佑、趨吉避凶。儀式共分八個步驟，由請神到擲筊，缺一不可。"
                  : "Villain Hitting (打小人) is a traditional folk ritual from the Canal Road Flyover in Hong Kong. On the day of Jingzhe (Awakening of Insects), people hire a granny priestess to beat a paper effigy of their \"villain\" with a sandal, driving away bad luck and ill-wishers. The full ceremony has 8 steps, from inviting the gods to divination."
                }
              </PixelText>

              <View style={styles.modalDivider} />

              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step1")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step2")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step3")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step4")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step5")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step6")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step7")}</PixelText>
              <PixelText size="sm" style={styles.tutorialStep}>{t("tutorial.step8")}</PixelText>

              <View style={styles.modalDivider} />

              <PixelText size="md" style={{ color: "#f39c12", marginBottom: 8 }}>{t("tutorial.tips")}</PixelText>
              <PixelText size="sm" style={styles.tutorialTip}>{t("tutorial.tip1")}</PixelText>
              <PixelText size="sm" style={styles.tutorialTip}>{t("tutorial.tip2")}</PixelText>
              <PixelText size="sm" style={styles.tutorialTip}>{t("tutorial.tip3")}</PixelText>
            </ScrollView>

            <PixelButton
              title={t("tutorial.close")}
              onPress={() => setShowTutorial(false)}
              color="#e74c3c"
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>

      <PixelText size="sm" style={styles.footer}>鵝頸橋下打小人</PixelText>
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
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.4,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 10, 46, 0.4)",
  },
  titleArea: {
    alignItems: "center",
    marginBottom: 24,
    zIndex: 2,
  },
  title: {
    color: "#f1c40f",
    fontSize: 48,
    textShadowColor: "#e74c3c",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    color: "#8b7db8",
    marginTop: 8,
  },
  grannyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    zIndex: 2,
    gap: 8,
  },
  sandalFloat: {
    marginLeft: -16,
  },
  buttonArea: {
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  langButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(241, 196, 15, 0.3)",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    color: "rgba(255,255,255,0.3)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a0a2e",
    borderWidth: 2,
    borderColor: "#f1c40f",
    padding: 20,
    maxHeight: "85%",
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#f1c40f",
    textAlign: "center",
    marginBottom: 12,
  },
  modalSubtitle: {
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 8,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "rgba(241, 196, 15, 0.3)",
    marginVertical: 12,
  },
  tutorialStep: {
    color: "#fff",
    marginBottom: 8,
    lineHeight: 18,
  },
  tutorialTip: {
    color: "#aaa",
    marginBottom: 6,
    lineHeight: 18,
  },
});
