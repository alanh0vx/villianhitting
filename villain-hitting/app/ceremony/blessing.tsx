import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PixelText } from "../../src/components/ui/PixelText";
import { PixelButton } from "../../src/components/ui/PixelButton";
import { BlessingCard } from "../../src/components/ceremony/BlessingCard";
import { PaperBurning } from "../../src/components/ceremony/PaperBurning";
import { DivinationBlocks } from "../../src/components/ceremony/DivinationBlocks";
import { SPRITES } from "../../src/engine/SpriteSheet";
import { useCeremonyGuard } from "../../src/hooks/useCeremonyGuard";

type PostBattlePhase = "dissolve" | "blessing" | "burn" | "divination" | "complete";

export default function BlessingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  useCeremonyGuard("victory");
  const [phase, setPhase] = useState<PostBattlePhase>("dissolve");

  const handleDivinationResult = (result: "holy" | "laugh" | "angry") => {
    if (result === "holy") {
      setPhase("complete");
    }
  };

  // Pick the right scene illustration per phase
  const sceneSource =
    phase === "dissolve" ? SPRITES.sceneDissolve.source
    : phase === "burn" ? SPRITES.sceneBurn.source
    : phase === "divination" ? SPRITES.sceneDivination.source
    : null;

  return (
    <View style={styles.container}>
      {/* Scene background illustration */}
      {sceneSource && (
        <>
          <Image source={sceneSource} style={styles.sceneBg} resizeMode="cover" />
          <View style={styles.overlay} />
        </>
      )}

      {/* Phase: Dissolve */}
      {phase === "dissolve" && (
        <Pressable style={styles.phaseContainer} onPress={() => setPhase("blessing")}>
          <View style={[styles.stepBadge, { top: Math.max(insets.top, 8) + 4 }]}>
            <PixelText size="sm" style={{ color: "#f1c40f" }}>⑤ {t("ceremony.dissolve")}</PixelText>
          </View>
          <PixelText size="xl" style={styles.title}>{t("ceremony.dissolve")}</PixelText>
          <PixelText size="md" style={styles.desc}>{t("ceremony.dissolveDesc")}</PixelText>
          <PixelText size="sm" style={[styles.prompt, { bottom: Math.max(insets.bottom, 20) + 12 }]}>{t("ceremony.tapToContinue")}</PixelText>
        </Pressable>
      )}

      {/* Phase: Blessing */}
      {phase === "blessing" && (
        <Pressable style={styles.phaseContainer} onPress={() => setPhase("burn")}>
          <View style={[styles.stepBadge, { top: Math.max(insets.top, 8) + 4 }]}>
            <PixelText size="sm" style={{ color: "#f1c40f" }}>⑥ {t("ceremony.blessing")}</PixelText>
          </View>
          <PixelText size="xl" style={styles.title}>{t("ceremony.blessing")}</PixelText>
          <BlessingCard />
          <PixelText size="sm" style={[styles.prompt, { bottom: Math.max(insets.bottom, 20) + 12 }]}>{t("ceremony.tapToContinue")}</PixelText>
        </Pressable>
      )}

      {/* Phase: Burn offerings */}
      {phase === "burn" && (
        <Pressable style={styles.phaseContainer} onPress={() => setPhase("divination")}>
          <View style={[styles.stepBadge, { top: Math.max(insets.top, 8) + 4 }]}>
            <PixelText size="sm" style={{ color: "#f1c40f" }}>⑦ {t("ceremony.burnOfferings")}</PixelText>
          </View>
          <PixelText size="xl" style={styles.title}>{t("ceremony.burnOfferings")}</PixelText>
          <PixelText size="md" style={styles.desc}>{t("ceremony.burnOfferingsDesc")}</PixelText>
          <PaperBurning />
          <PixelText size="sm" style={[styles.prompt, { bottom: Math.max(insets.bottom, 20) + 12 }]}>{t("ceremony.tapToContinue")}</PixelText>
        </Pressable>
      )}

      {/* Phase: Divination */}
      {phase === "divination" && (
        <View style={styles.phaseContainer}>
          <View style={[styles.stepBadge, { top: Math.max(insets.top, 8) + 4 }]}>
            <PixelText size="sm" style={{ color: "#f1c40f" }}>⑧ {t("ceremony.divination")}</PixelText>
          </View>
          <DivinationBlocks onResult={handleDivinationResult} />
        </View>
      )}

      {/* Phase: Complete */}
      {phase === "complete" && (
        <View style={styles.phaseContainer}>
          <PixelText size="xl" style={[styles.title, { color: "#f1c40f" }]}>
            🎉 {t("victory.celebrate")} 🎉
          </PixelText>
          <PixelText size="md" style={styles.desc}>{t("victory.holyBlocks")}</PixelText>
          <View style={{ marginTop: 30 }}>
            <PixelButton
              title={`🔄 ${t("victory.playAgain")}`}
              onPress={() => router.replace("/")}
              color="#2ecc71"
              size="lg"
            />
          </View>
        </View>
      )}
    </View>
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
    opacity: 0.45,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 10, 46, 0.35)",
  },
  phaseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stepBadge: {
    position: "absolute",
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#f1c40f",
  },
  title: {
    color: "#f1c40f",
    marginBottom: 16,
  },
  desc: {
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  prompt: {
    position: "absolute",
    color: "rgba(255,255,255,0.5)",
  },
});
