import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { PixelText } from "../../src/components/ui/PixelText";
import { PixelButton } from "../../src/components/ui/PixelButton";
import { MenuPanel } from "../../src/components/ui/MenuPanel";
import { useGameStore } from "../../src/engine/GameState";
import { SPRITES, getClipStyle } from "../../src/engine/SpriteSheet";
import { validateFaceImage, pixelateImage } from "../../src/utils/pixelateImage";
import { useCeremonyGuard } from "../../src/hooks/useCeremonyGuard";

export default function CreateVillainScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setVillainImage, initVillain, villainMaxHp, setCeremonyStep } = useGameStore();
  useCeremonyGuard("invite-gods");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pixelatedUri, setPixelatedUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effigyScale = useSharedValue(0);

  const pickImage = async (useCamera: boolean) => {
    try {
      setError(null);
      const opts: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const w = asset.width ?? 0;
        const h = asset.height ?? 0;

        // Validate face image
        const validation = validateFaceImage(w, h);
        if (!validation.valid) {
          setError(validation.message);
          return;
        }

        // Pixelate the image for 8-bit style
        let processedUri = asset.uri;
        try {
          processedUri = await pixelateImage(asset.uri);
        } catch {
          // Fallback to original if pixelation fails
          processedUri = asset.uri;
        }

        setImageUri(asset.uri);
        setPixelatedUri(processedUri);
        setVillainImage(processedUri);
        initVillain();
        setCeremonyStep("create-villain");
        effigyScale.value = withSpring(1, { damping: 8, stiffness: 120 });
      }
    } catch {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const effigyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: effigyScale.value }],
  }));

  // Scene illustration
  const sceneClip = getClipStyle(SPRITES.sceneDeclare, 0, 1);

  // Effigy sprite (clean state)
  const effigyClip = getClipStyle(SPRITES.villainEffigy, 0, 2);

  return (
    <View style={styles.container}>
      {/* Scene background illustration */}
      <Image
        source={SPRITES.sceneDeclare.source}
        style={styles.sceneBg}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Step indicator */}
      <View style={styles.stepBadge}>
        <PixelText size="sm" style={{ color: "#f1c40f" }}>
          ② {t("ceremony.declaration")}
        </PixelText>
      </View>

      <View style={styles.content}>
        <PixelText size="lg" style={styles.title}>
          {t("ceremony.uploadPhoto")}
        </PixelText>

        {/* Error message */}
        {error && (
          <View style={styles.errorBox}>
            <PixelText size="sm" style={{ color: "#e74c3c" }}>{error}</PixelText>
          </View>
        )}

        {/* Photo buttons */}
        {!pixelatedUri && (
          <View style={styles.photoButtons}>
            <PixelButton
              title={`📷 ${t("ceremony.takePhoto")}`}
              onPress={() => pickImage(true)}
              color="#2ecc71"
            />
            <PixelButton
              title={`🖼️ ${t("ceremony.choosePhoto")}`}
              onPress={() => pickImage(false)}
              color="#3498db"
            />
          </View>
        )}

        {/* Villain effigy preview with pixelated photo */}
        {pixelatedUri && (
          <Animated.View style={[styles.effigyContainer, effigyStyle]}>
            <MenuPanel style={styles.effigyPanel}>
              <PixelText size="md" style={{ color: "#f1c40f" }}>
                {t("ceremony.villainReady")}
              </PixelText>

              {/* Paper effigy sprite with photo overlay */}
              <View style={styles.effigyWrapper}>
                <View style={effigyClip.container}>
                  <Image
                    source={SPRITES.villainEffigy.source}
                    style={effigyClip.image}
                    resizeMode="stretch"
                  />
                </View>
                {/* Pixelated villain face */}
                <View style={styles.faceOverlay}>
                  <Image
                    source={{ uri: pixelatedUri }}
                    style={styles.faceImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Before / after comparison */}
              <View style={styles.compareRow}>
                <View style={styles.compareItem}>
                  <PixelText size="sm">原相</PixelText>
                  <Image source={{ uri: imageUri! }} style={styles.thumbImage} resizeMode="cover" />
                </View>
                <PixelText size="lg">→</PixelText>
                <View style={styles.compareItem}>
                  <PixelText size="sm">小人化</PixelText>
                  <Image source={{ uri: pixelatedUri }} style={styles.thumbImage} resizeMode="cover" />
                </View>
              </View>

              <View style={styles.hpDisplay}>
                <PixelText size="sm">{t("ceremony.villainHP")}:</PixelText>
                <PixelText size="lg" style={{ color: "#e74c3c" }}>{villainMaxHp}</PixelText>
              </View>
            </MenuPanel>

            <PixelButton
              title={`👡 ${t("battle.title")}`}
              onPress={() => router.push("/battle")}
              color="#e74c3c"
              size="lg"
            />

            {/* Re-pick */}
            <PixelButton
              title="重新揀相"
              onPress={() => {
                setPixelatedUri(null);
                setImageUri(null);
                setError(null);
              }}
              color="#555"
              size="sm"
              style={{ marginTop: 8 }}
            />
          </Animated.View>
        )}

        {/* Skip for testing */}
        {!pixelatedUri && (
          <PixelButton
            title="跳過 (Skip)"
            onPress={() => {
              initVillain();
              setCeremonyStep("create-villain");
              router.push("/battle");
            }}
            color="#555"
            size="sm"
            style={{ marginTop: 20 }}
          />
        )}
      </View>
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
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 10, 46, 0.5)",
  },
  stepBadge: {
    position: "absolute",
    top: 44,
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
    paddingHorizontal: 24,
  },
  title: {
    color: "#f1c40f",
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    borderWidth: 1,
    borderColor: "#e74c3c",
    padding: 8,
    marginBottom: 12,
  },
  photoButtons: {
    gap: 16,
  },
  effigyContainer: {
    alignItems: "center",
    gap: 12,
  },
  effigyPanel: {
    alignItems: "center",
    gap: 10,
  },
  effigyWrapper: {
    position: "relative",
  },
  faceOverlay: {
    position: "absolute",
    top: 36,
    left: 36,
    width: 56,
    height: 56,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  faceImage: {
    width: "100%",
    height: "100%",
  },
  compareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  compareItem: {
    alignItems: "center",
    gap: 4,
  },
  thumbImage: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "#f1c40f",
  },
  hpDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
