import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useGameStore } from "../../engine/GameState";
import { SPRITES, WEAPON_SPRITE_INDEX, getClipStyle } from "../../engine/SpriteSheet";
import { CHANTS } from "../../data/chants";
import { WEAPONS } from "../../data/weapons";
import { MOVES } from "../../data/moves";
import { HPBar } from "./HPBar";
import { VillainEffigy } from "./VillainEffigy";
import { HitterSprite } from "./HitterSprite";
import { ChantBubble } from "./ChantBubble";
import { DamageNumber } from "./DamageNumber";
import { PixelButton } from "../ui/PixelButton";
import { PixelText } from "../ui/PixelText";
import { MenuPanel } from "../ui/MenuPanel";

interface BattleSceneProps {
  onVictory: () => void;
}

export function BattleScene({ onVictory }: BattleSceneProps) {
  const { t } = useTranslation();
  const {
    villainHp, villainMaxHp, villainImageUri,
    selectedChant, selectedWeapon, selectedMove,
    turn, chargeCount, tigerActive, isAnimating,
    lastDamage, lastCrit,
    selectChant, selectWeapon, selectMove,
    performAttack, applyDot, feedTiger, triggerTiger,
    setAnimating,
  } = useGameStore();

  const [showChantBubble, setShowChantBubble] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [activeTab, setActiveTab] = useState<"chant" | "weapon" | "move">("chant");

  const handleAttack = useCallback(() => {
    if (isAnimating) return;
    setAnimating(true);
    setShowChantBubble(true);

    if (Math.random() < 0.1 && !tigerActive) {
      triggerTiger();
    }

    setTimeout(() => {
      setIsHit(true);
      const damage = performAttack();
      setShowDamage(true);

      setTimeout(() => {
        applyDot();
        setShowChantBubble(false);
        setIsHit(false);

        setTimeout(() => {
          setShowDamage(false);
          setAnimating(false);
          if (useGameStore.getState().villainHp <= 0) {
            setTimeout(() => onVictory(), 500);
          }
        }, 500);
      }, 600);
    }, 500);
  }, [isAnimating]);

  // Weapon icon for selection panel
  const renderWeaponIcon = (weaponId: string, iconScale: number = 1) => {
    const idx = WEAPON_SPRITE_INDEX[weaponId] ?? 0;
    const clip = getClipStyle(SPRITES.weaponsIcons, idx, iconScale);
    return (
      <View style={clip.container}>
        <Image source={SPRITES.weaponsIcons.source} style={clip.image} resizeMode="stretch" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background — 鵝頸橋 */}
      <Image
        source={SPRITES.bgBattle.source}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Top HUD */}
      <View style={styles.hud}>
        <View style={styles.turnBadge}>
          <PixelText size="sm">{t("battle.turn", { turn })}</PixelText>
        </View>
        <HPBar hp={villainHp} maxHp={villainMaxHp} />
      </View>

      {/* Main battle area — VERTICAL layout: granny on top, effigy below on ground */}
      <View style={styles.battleArea}>
        {/* Granny — positioned above, hitting downward */}
        <View style={styles.grannyArea}>
          <View style={{ position: "relative" }}>
            <ChantBubble text={t(selectedChant.i18nKey)} visible={showChantBubble} />
            <HitterSprite
              isAttacking={isAnimating}
              moveId={selectedMove.id}
              weaponId={selectedWeapon.id}
            />
          </View>
        </View>

        {/* Ground / step area where the effigy lies */}
        <View style={styles.groundArea}>
          {/* Small brick/step */}
          <View style={styles.groundStep} />

          {/* Paper effigy on the ground */}
          <View style={styles.effigyOnGround}>
            {showDamage && lastDamage > 0 && (
              <DamageNumber damage={lastDamage} isCrit={lastCrit} />
            )}
            <VillainEffigy
              imageUri={villainImageUri}
              hp={villainHp}
              maxHp={villainMaxHp}
              isHit={isHit}
            />
          </View>

          {/* Ground decoration — incense, offerings */}
          <View style={styles.groundDecor}>
            <View style={styles.incensePot} />
          </View>
        </View>
      </View>

      {/* Tiger event */}
      {tigerActive && (
        <MenuPanel style={styles.tigerPanel}>
          <PixelText size="sm">{t("battle.tigerEvent")}</PixelText>
          <PixelButton title={t("battle.tigerFeed")} onPress={feedTiger} color="#f39c12" size="sm" />
        </MenuPanel>
      )}

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Tabs */}
        <View style={styles.tabRow}>
          {(["chant", "weapon", "move"] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <PixelText size="sm">
                {tab === "chant" ? t("battle.selectChant")
                  : tab === "weapon" ? t("battle.selectWeapon")
                  : t("battle.selectMove")}
              </PixelText>
            </Pressable>
          ))}
        </View>

        {/* Selection panel */}
        {activeTab === "chant" ? (
          <ScrollView style={styles.selectionPanel} showsVerticalScrollIndicator={false}>
            <View style={styles.chantGrid}>
              {CHANTS.map((chant) => (
                <Pressable
                  key={chant.id}
                  onPress={() => selectChant(chant.id)}
                  style={[styles.chantItem, selectedChant.id === chant.id && styles.selectedItem]}
                >
                  <PixelText size="sm" style={styles.selectionText}>
                    {t(chant.i18nKey)}
                  </PixelText>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.selectionPanel} horizontal showsHorizontalScrollIndicator={false}>
            {activeTab === "weapon" && WEAPONS.map((weapon) => (
              <Pressable
                key={weapon.id}
                onPress={() => selectWeapon(weapon.id)}
                style={[styles.selectionItem, selectedWeapon.id === weapon.id && styles.selectedItem]}
              >
                {renderWeaponIcon(weapon.id, 1.2)}
                <PixelText size="sm">{t(weapon.i18nKey)}</PixelText>
                <PixelText size="sm" style={{ color: "#f39c12" }}>{weapon.damageMultiplier}x</PixelText>
              </Pressable>
            ))}
            {activeTab === "move" && MOVES.map((move) => (
              <Pressable
                key={move.id}
                onPress={() => selectMove(move.id)}
                style={[
                  styles.selectionItem,
                  selectedMove.id === move.id && styles.selectedItem,
                  move.chargeRequired > 0 && chargeCount < move.chargeRequired && styles.lockedItem,
                ]}
              >
                <PixelText size="sm">{t(move.i18nKey)}</PixelText>
                <PixelText size="sm" style={{ color: "#f39c12" }}>
                  {move.damageMultiplier}x {move.hits > 1 ? `×${move.hits}` : ""}
                </PixelText>
                {move.chargeRequired > 0 && (
                  <PixelText size="sm" style={{ color: "#e74c3c" }}>
                    ⚡{chargeCount}/{move.chargeRequired}
                  </PixelText>
                )}
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Attack button */}
        <View style={styles.attackRow}>
          <PixelButton
            title={`${t("battle.hit")} 👡`}
            onPress={handleAttack}
            disabled={isAnimating}
            color="#e74c3c"
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0a2e",
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  hud: {
    paddingTop: 44,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  turnBadge: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#f1c40f",
    marginBottom: 4,
  },
  // Vertical battle layout: granny on top, effigy below
  battleArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  grannyArea: {
    alignItems: "center",
    zIndex: 5,
    marginBottom: -20, // overlap slightly with ground area (hitting down)
  },
  groundArea: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
    position: "relative",
  },
  groundStep: {
    width: 140,
    height: 16,
    backgroundColor: "rgba(120, 80, 40, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(80, 50, 20, 0.8)",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginBottom: -4,
  },
  effigyOnGround: {
    alignItems: "center",
    position: "relative",
    // Tilt the effigy to look like it's lying flat / propped against step
    transform: [{ perspective: 300 }, { rotateX: "15deg" }],
  },
  groundDecor: {
    flexDirection: "row",
    marginTop: 4,
    gap: 24,
    opacity: 0.6,
  },
  incensePot: {
    width: 16,
    height: 12,
    backgroundColor: "#8b4513",
    borderRadius: 4,
  },
  tigerPanel: {
    position: "absolute",
    top: "40%",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(243, 156, 18, 0.9)",
    borderColor: "#f39c12",
    zIndex: 20,
  },
  controls: {
    backgroundColor: "rgba(26, 10, 46, 0.95)",
    borderTopWidth: 2,
    borderTopColor: "#f1c40f",
  },
  tabRow: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    backgroundColor: "rgba(26, 10, 46, 0.8)",
    borderRightWidth: 1,
    borderRightColor: "#f1c40f",
  },
  activeTab: {
    backgroundColor: "rgba(241, 196, 15, 0.2)",
  },
  selectionPanel: {
    maxHeight: 120,
    borderTopWidth: 1,
    borderTopColor: "rgba(241, 196, 15, 0.3)",
  },
  chantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 3,
  },
  chantItem: {
    width: "50%",
    padding: 6,
    borderWidth: 2,
    borderColor: "#555",
    backgroundColor: "rgba(26, 10, 46, 0.9)",
  },
  selectionItem: {
    padding: 6,
    marginHorizontal: 3,
    marginVertical: 3,
    borderWidth: 2,
    borderColor: "#555",
    backgroundColor: "rgba(26, 10, 46, 0.9)",
    minWidth: 75,
    alignItems: "center",
  },
  selectedItem: {
    borderColor: "#f1c40f",
    backgroundColor: "rgba(241, 196, 15, 0.15)",
  },
  lockedItem: {
    opacity: 0.5,
  },
  selectionText: {
    textAlign: "center",
  },
  attackRow: {
    padding: 10,
    alignItems: "center",
  },
});
