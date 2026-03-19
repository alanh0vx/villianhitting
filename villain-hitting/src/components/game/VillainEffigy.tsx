import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { getTearState } from "../../engine/GameState";
import { SPRITES, getClipStyle } from "../../engine/SpriteSheet";

interface VillainEffigyProps {
  imageUri: string | null;
  hp: number;
  maxHp: number;
  isHit: boolean;
}

const TEAR_INDEX: Record<string, number> = {
  clean: 0,
  cornerTears: 1,
  visibleRips: 2,
  majorTears: 3,
  nearlyDestroyed: 4,
};

export function VillainEffigy({ imageUri, hp, maxHp, isHit }: VillainEffigyProps) {
  const tearState = getTearState(hp, maxHp);
  const frameIndex = TEAR_INDEX[tearState] ?? 0;
  const shakeX = useSharedValue(0);
  const scale = 1.5; // Display at 1.5x size (96x144)

  React.useEffect(() => {
    if (isHit) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 40 }),
        withTiming(8, { duration: 40 }),
        withTiming(-6, { duration: 40 }),
        withTiming(6, { duration: 40 }),
        withTiming(-3, { duration: 40 }),
        withTiming(0, { duration: 40 })
      );
    }
  }, [isHit, hp]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const clip = getClipStyle(SPRITES.villainEffigy, frameIndex, scale);

  return (
    <Animated.View style={[styles.container, animStyle]}>
      {/* Effigy sprite */}
      <View style={clip.container}>
        <Image
          source={SPRITES.villainEffigy.source}
          style={clip.image}
          resizeMode="stretch"
        />
      </View>

      {/* Villain face overlay — positioned on the face area of the effigy */}
      {imageUri && (
        <View style={[styles.faceOverlay, {
          width: 28 * scale,
          height: 28 * scale,
          top: 18 * scale,
          left: (64 / 2 - 14) * scale,
        }]}>
          <Image
            source={{ uri: imageUri }}
            style={styles.faceImage}
            resizeMode="cover"
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  faceOverlay: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  faceImage: {
    width: "100%",
    height: "100%",
  },
});
