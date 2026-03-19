import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useGameStore, CeremonyStep } from "../engine/GameState";

/**
 * Maps each route to the minimum ceremonyStep required to access it.
 * If the current step hasn't reached the prerequisite, redirect to home.
 */
const STEP_ORDER: CeremonyStep[] = [
  "title",
  "invite-gods",
  "create-villain",
  "battle",
  "victory",
];

export function useCeremonyGuard(requiredStep: CeremonyStep) {
  const router = useRouter();
  const ceremonyStep = useGameStore((s) => s.ceremonyStep);

  useEffect(() => {
    const currentIdx = STEP_ORDER.indexOf(ceremonyStep);
    const requiredIdx = STEP_ORDER.indexOf(requiredStep);

    if (currentIdx < requiredIdx) {
      const msg =
        Platform.OS === "web"
          ? "請由頭開始儀式，否則打小人無效㗎！\nPlease start from the beginning, or the ritual won't work!"
          : "請由頭開始儀式，否則打小人無效㗎！";

      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("⚠️", msg);
      }
      router.replace("/");
    }
  }, []);
}
