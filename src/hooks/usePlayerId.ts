/** @format */

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const PLAYER_ID_KEY = "ticTacToePlayerId";

export function usePlayerId(): string {
  const [playerId, setPlayerId] = useState<string>("");

  useEffect(() => {
    let storedPlayerId = localStorage.getItem(PLAYER_ID_KEY);
    if (!storedPlayerId) {
      storedPlayerId = uuidv4();
      localStorage.setItem(PLAYER_ID_KEY, storedPlayerId);
    }
    setPlayerId(storedPlayerId);
  }, []);

  return playerId;
}
