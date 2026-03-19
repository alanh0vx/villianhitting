import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { type SpriteSheetConfig, getClipStyle } from "../../engine/SpriteSheet";

interface SpriteAnimatorProps {
  sprite: SpriteSheetConfig;
  frameIndex: number;
  scale?: number;
  flipX?: boolean;
}

export function SpriteAnimator({ sprite, frameIndex, scale = 1, flipX = false }: SpriteAnimatorProps) {
  const clip = getClipStyle(sprite, frameIndex, scale);

  return (
    <View
      style={[
        clip.container,
        flipX && { transform: [{ scaleX: -1 }] },
      ]}
    >
      <Image
        source={sprite.source}
        style={clip.image}
        resizeMode="stretch"
      />
    </View>
  );
}
