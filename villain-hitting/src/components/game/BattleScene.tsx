import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Pressable, Image, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const {
    villainHp, villainMaxHp, villainImageUri,
    villainName, customChants,
    selectedChant, selectedWeapon, selectedMove,
    turn, chargeCount, tigerActive, isAnimating,
    lastDamage, lastCrit,
    grannyStamina, grannyMaxStamina,
    selectChant, selectWeapon, selectMove,
    performAttack, applyDot, feedTiger, dismissTiger, triggerTiger,
    consumeStamina, regenStamina,
    setAnimating,
  } = useGameStore();
  const displayName = villainName || t("ui.defaultVillainName");

  const [showChantBubble, setShowChantBubble] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [activeTab, setActiveTab] = useState<"chant" | "weapon" | "move">("chant");
  const [chantDropdownOpen, setChantDropdownOpen] = useState(false);
  const [chantHistory, setChantHistory] = useState<string[]>([]);
  const [tigerHistory, setTigerHistory] = useState<string[]>([]);
  const [selectedCustomChant, setSelectedCustomChant] = useState<string | null>(null);
  const marqueeX = useSharedValue(0);
  const marqueeContainerWidth = useRef(300);
  const marqueeTextWidth = useRef(0);

  // Restart marquee animation when history changes
  useEffect(() => {
    if (chantHistory.length === 0) return;
    // Estimate text width: each CJK char ~14px, latin ~8px
    const text = chantHistory.join("  ·  ");
    const estCharWidth = /[\u4e00-\u9fff]/.test(text) ? 12 : 8;
    const textW = marqueeTextWidth.current || text.length * estCharWidth;
    const containerW = marqueeContainerWidth.current;
    const totalDistance = containerW + textW;
    const duration = Math.max(totalDistance * 30, 6000);
    // Cancel previous, start from right edge, scroll to left
    cancelAnimation(marqueeX);
    marqueeX.value = containerW;
    marqueeX.value = withDelay(100, withRepeat(
      withTiming(-textW, { duration, easing: Easing.linear }),
      -1,
      false,
    ));
  }, [chantHistory.length]);

  // Stamina regen every second
  useEffect(() => {
    const interval = setInterval(() => {
      regenStamina();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const marqueeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: marqueeX.value }],
  }));

  // Wrap tiger actions to record history
  const handleFeedTiger = useCallback(() => {
    setTigerHistory((prev) => [t("battle.tigerFed"), ...prev].slice(0, 10));
    feedTiger();
  }, []);

  const handleDismissTiger = useCallback(() => {
    setTigerHistory((prev) => [t("battle.tigerSkipped"), ...prev].slice(0, 10));
    dismissTiger();
  }, []);

  const handleAttack = useCallback(() => {
    if (isAnimating) return;
    // Consume stamina (20 per attack)
    const hasStamina = consumeStamina(20);
    if (!hasStamina) return;

    setAnimating(true);
    setShowChantBubble(true);

    // Record chant to history
    const chantText = selectedCustomChant || t(selectedChant.i18nKey);
    setChantHistory((prev) => [chantText, ...prev].slice(0, 20));

    setTimeout(() => {
      setIsHit(true);
      const damage = performAttack();
      setShowDamage(true);

      setTimeout(() => {
        applyDot();
        setIsHit(false);

        setTimeout(() => {
          setShowChantBubble(false);
          setShowDamage(false);

          if (useGameStore.getState().villainHp <= 0) {
            setAnimating(false);
            setTimeout(() => onVictory(), 500);
          } else if (Math.random() < 0.3) {
            // Tiger event — triggers AFTER the attack, pauses until user interacts
            triggerTiger();
          } else {
            setAnimating(false);
          }
        }, 1500);
      }, 600);
    }, 500);
  }, [isAnimating, selectedChant]);

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
      <View style={[styles.hud, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.turnBadge}>
          <PixelText size="sm">{t("battle.turn", { turn })}</PixelText>
        </View>
        <HPBar hp={villainHp} maxHp={villainMaxHp} label={t("ceremony.villainHP", { name: displayName })} />
        {/* Poem history marquee */}
        {chantHistory.length > 0 && (
          <View
            style={styles.chantMarquee}
            onLayout={(e) => { marqueeContainerWidth.current = e.nativeEvent.layout.width; }}
          >
            <Animated.Text
              style={[styles.chantMarqueeText, marqueeStyle]}
              numberOfLines={1}
              onLayout={(e) => { marqueeTextWidth.current = e.nativeEvent.layout.width; }}
            >
              {chantHistory.join("  ·  ")}
            </Animated.Text>
          </View>
        )}
        {/* Tiger event history */}
        {tigerHistory.length > 0 && (
          <View style={styles.tigerHistoryRow}>
            <Text style={styles.tigerHistoryText} numberOfLines={1}>
              {tigerHistory[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Main battle area — VERTICAL layout: granny on top, effigy below on ground */}
      <View style={styles.battleArea}>
        {/* Granny — positioned above, hitting downward */}
        <View style={styles.grannyArea}>
          <View style={{ position: "relative" }}>
            <ChantBubble text={selectedCustomChant || t(selectedChant.i18nKey)} visible={showChantBubble} />
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

      {/* Tiger event — appears after attack, blocks input until user responds */}
      {tigerActive && (
        <MenuPanel style={styles.tigerPanel}>
          <PixelText size="sm" style={{ flex: 1 }}>{t("battle.tigerEvent")}</PixelText>
          <View style={styles.tigerButtons}>
            <PixelButton title={t("battle.tigerFeed")} onPress={handleFeedTiger} color="#f39c12" size="sm" />
            <PixelButton title={t("battle.tigerSkip")} onPress={handleDismissTiger} color="#888" size="sm" />
          </View>
        </MenuPanel>
      )}

      {/* Stamina bar */}
      <View style={styles.staminaContainer}>
        <PixelText size="sm" style={{ color: "#3498db" }}>{t("battle.stamina")}</PixelText>
        <View style={styles.staminaBarBg}>
          <View style={[styles.staminaBarFill, { width: `${(grannyStamina / grannyMaxStamina) * 100}%` as `${number}%` }]} />
        </View>
        <PixelText size="sm" style={{ color: "#aaa" }}>{grannyStamina}/{grannyMaxStamina}</PixelText>
      </View>

      {/* Bottom controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom }]}>
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
          <View style={styles.chantDropdownContainer}>
            {/* Selected chant display / toggle */}
            <Pressable
              onPress={() => setChantDropdownOpen(!chantDropdownOpen)}
              style={[styles.chantSelected, chantDropdownOpen && styles.chantSelectedOpen]}
            >
              <PixelText size="sm" numberOfLines={1} style={{ flex: 1 }}>
                {selectedCustomChant || t(selectedChant.i18nKey)}
              </PixelText>
              <PixelText size="sm">{chantDropdownOpen ? "▲" : "▼"}</PixelText>
            </Pressable>

            {/* Dropdown list */}
            {chantDropdownOpen && (
              <ScrollView style={styles.chantDropdownList} showsVerticalScrollIndicator={false}>
                {CHANTS.map((chant) => (
                  <Pressable
                    key={chant.id}
                    onPress={() => {
                      selectChant(chant.id);
                      setSelectedCustomChant(null);
                      setChantDropdownOpen(false);
                    }}
                    style={[styles.chantDropdownItem, !selectedCustomChant && selectedChant.id === chant.id && styles.selectedItem]}
                  >
                    <PixelText size="sm" numberOfLines={1}>
                      {t(chant.i18nKey)}
                    </PixelText>
                  </Pressable>
                ))}
                {customChants.map((chant, i) => (
                  <Pressable
                    key={`custom-${i}`}
                    onPress={() => {
                      setSelectedCustomChant(chant);
                      setChantDropdownOpen(false);
                    }}
                    style={[styles.chantDropdownItem, selectedCustomChant === chant && styles.selectedItem]}
                  >
                    <PixelText size="sm" numberOfLines={1} style={{ color: "#2ecc71" }}>
                      ★ {chant}
                    </PixelText>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        ) : (
          <ScrollView style={styles.selectionPanel} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
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
  chantMarquee: {
    marginTop: 6,
    marginHorizontal: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 3,
    overflow: "hidden",
    borderRadius: 2,
  },
  chantMarqueeText: {
    color: "rgba(241, 196, 15, 0.7)",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  tigerHistoryRow: {
    marginTop: 3,
    marginHorizontal: 4,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 2,
  },
  tigerHistoryText: {
    color: "rgba(243, 156, 18, 0.8)",
    fontSize: 9,
    fontWeight: "bold",
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
  tigerButtons: {
    flexDirection: "row",
    gap: 6,
  },
  staminaContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    gap: 6,
  },
  staminaBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#3498db",
    overflow: "hidden",
  },
  staminaBarFill: {
    height: "100%",
    backgroundColor: "#3498db",
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
    maxHeight: 90,
    borderTopWidth: 1,
    borderTopColor: "rgba(241, 196, 15, 0.3)",
  },
  chantDropdownContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(241, 196, 15, 0.3)",
  },
  chantSelected: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(241, 196, 15, 0.15)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241, 196, 15, 0.3)",
    gap: 8,
  },
  chantSelectedOpen: {
    borderBottomColor: "#f1c40f",
  },
  chantDropdownList: {
    maxHeight: 120,
  },
  chantDropdownItem: {
    padding: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  selectionItem: {
    padding: 6,
    marginHorizontal: 3,
    marginVertical: 3,
    borderWidth: 2,
    borderColor: "#555",
    backgroundColor: "rgba(26, 10, 46, 0.9)",
    minWidth: 65,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
});
