import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useGameStore } from "../../src/engine/GameState";
import { BattleScene } from "../../src/components/game/BattleScene";
import { useCeremonyGuard } from "../../src/hooks/useCeremonyGuard";

export default function BattleScreen() {
  const router = useRouter();
  const setCeremonyStep = useGameStore((s) => s.setCeremonyStep);
  useCeremonyGuard("create-villain");

  useEffect(() => {
    setCeremonyStep("battle");
  }, []);

  const handleVictory = () => {
    setCeremonyStep("victory");
    router.push("/victory");
  };

  return <BattleScene onVictory={handleVictory} />;
}
