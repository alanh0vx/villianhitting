import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { SPRITES, MOVE_SPRITE_MAP, WEAPON_SPRITE_INDEX, getClipStyle } from "../../engine/SpriteSheet";

interface HitterSpriteProps {
  isAttacking: boolean;
  moveId: string;
  weaponId: string;
}

export function HitterSprite({ isAttacking, moveId, weaponId }: HitterSpriteProps) {
  const [frame, setFrame] = useState(0);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scale = 1.8;

  const bodyY = useSharedValue(0);

  // Idle breathing
  useEffect(() => {
    bodyY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Attack animation: cycle through sprite frames
  useEffect(() => {
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }

    if (isAttacking) {
      const spriteConfig = MOVE_SPRITE_MAP[moveId] ?? SPRITES.grannySlap;
      let currentFrame = 0;
      setFrame(0);
      animRef.current = setInterval(() => {
        currentFrame++;
        if (currentFrame >= spriteConfig.frameCount) {
          currentFrame = spriteConfig.frameCount - 1;
          if (animRef.current) clearInterval(animRef.current);
        }
        setFrame(currentFrame);
      }, 80);
    } else {
      setFrame(0);
    }

    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isAttacking, moveId]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: isAttacking ? 0 : bodyY.value }],
  }));

  const spriteConfig = isAttacking
    ? (MOVE_SPRITE_MAP[moveId] ?? SPRITES.grannySlap)
    : SPRITES.grannyIdle;
  const idleFrame = isAttacking ? frame : frame % SPRITES.grannyIdle.frameCount;

  // Idle frame cycling
  useEffect(() => {
    if (!isAttacking) {
      const iv = setInterval(() => setFrame((f) => f + 1), 250);
      return () => clearInterval(iv);
    }
  }, [isAttacking]);

  const grannyClip = getClipStyle(spriteConfig, idleFrame, scale);

  // Weapon overlay (in-hand version)
  const weaponIndex = WEAPON_SPRITE_INDEX[weaponId] ?? 0;
  const weaponClip = getClipStyle(SPRITES.weaponsInhand, weaponIndex, scale * 0.8);

  return (
    <Animated.View style={[styles.container, bodyStyle]}>
      {/* Granny sprite */}
      <View style={grannyClip.container}>
        <Image
          source={spriteConfig.source}
          style={grannyClip.image}
          resizeMode="stretch"
        />
      </View>

      {/* Weapon overlay on hand area */}
      <View style={[styles.weaponOverlay, {
        right: -8 * scale,
        top: 20 * scale,
      }]}>
        <View style={weaponClip.container}>
          <Image
            source={SPRITES.weaponsInhand.source}
            style={weaponClip.image}
            resizeMode="stretch"
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  weaponOverlay: {
    position: "absolute",
  },
});
