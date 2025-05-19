/** @format */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { database } from "@/lib/firebase";
import { ref, set, runTransaction } from "firebase/database";

// --- Types ---
export type PlayerSymbol = "X" | "O";
export type CellState = PlayerSymbol | "";
export type BoardState = CellState[];

export interface PlayerInfo {
  id: string;
  symbol: PlayerSymbol;
}

export interface GameState {
  gameId: string | null;
  board: BoardState;
  currentTurn: PlayerSymbol;
  winner: PlayerSymbol | "draw" | "";
  players: {
    X: string | null;
    O: string | null;
  };
  localPlayerRole: PlayerSymbol | "spectator" | null;
  isLoading: boolean;
  error: string | null;
  gameNotFound: boolean;
}

const initialState: GameState = {
  gameId: null,
  board: Array(9).fill(""),
  currentTurn: "X",
  winner: "",
  players: { X: null, O: null },
  localPlayerRole: null,
  isLoading: false,
  error: null,
  gameNotFound: false,
};

// --- Helper function for winner checking ---
export function checkWinnerLogic(
  board: BoardState
): PlayerSymbol | "draw" | "" {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as PlayerSymbol;
    }
  }
  if (board.every((cell) => cell !== "")) return "draw";
  return "";
}

// --- Async Thunks ---

// Create a new game
export const createNewGame = createAsyncThunk<
  string, // Return type
  string, // gameId
  { rejectValue: string }
>("game/createNewGame", async (gameId, { dispatch, rejectWithValue }) => {
  try {
    const initialGameData = {
      board: Array(9).fill(""),
      currentTurn: "X" as PlayerSymbol,
      winner: "",
      players: { X: null, O: null },
      createdAt: Date.now(),
    };
    await set(ref(database, `games/${gameId}`), initialGameData);
    dispatch(setGameData({ ...initialGameData, gameId }));
    return gameId;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to create game");
  }
});

// Make a move (transactional, robust)
export const makeMove = createAsyncThunk<
  void,
  { gameId: string; position: number },
  { state: { game: GameState }; rejectValue: string }
>(
  "game/makeMove",
  async ({ gameId, position }, { getState, rejectWithValue }) => {
    const state = getState().game;
    const player = state.localPlayerRole;
    if (!player || player === "spectator") {
      return rejectWithValue("You are not a player.");
    }

    const gameRef = ref(database, `games/${gameId}`);
    try {
      await runTransaction(gameRef, (currentGame) => {
        if (!currentGame) return; // Game not found

        // Validate move against latest DB state
        if (
          currentGame.winner ||
          currentGame.board[position] !== "" ||
          currentGame.currentTurn !== player
        ) {
          return; // Invalid move
        }

        const newBoard = [...currentGame.board];
        newBoard[position] = player;
        const newWinner = checkWinnerLogic(newBoard);
        const nextTurn = newWinner ? "" : player === "X" ? "O" : "X";

        return {
          ...currentGame,
          board: newBoard,
          currentTurn: nextTurn,
          winner: newWinner,
        };
      });
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to make move");
    }
  }
);

// Assign player role (transactional)
export const assignPlayerRole = createAsyncThunk<
  PlayerSymbol | "spectator",
  { gameId: string; playerId: string },
  { rejectValue: string }
>(
  "game/assignPlayerRole",
  async ({ gameId, playerId }, { rejectWithValue }) => {
    const playersRef = ref(database, `games/${gameId}/players`);
    let assignedRole: PlayerSymbol | "spectator" = "spectator";
    try {
      await runTransaction(playersRef, (currentPlayers) => {
        if (!currentPlayers) currentPlayers = { X: null, O: null };

        if (currentPlayers.X === playerId) {
          assignedRole = "X";
          return currentPlayers;
        }
        if (currentPlayers.O === playerId) {
          assignedRole = "O";
          return currentPlayers;
        }
        if (!currentPlayers.X) {
          currentPlayers.X = playerId;
          assignedRole = "X";
          return currentPlayers;
        }
        if (!currentPlayers.O) {
          currentPlayers.O = playerId;
          assignedRole = "O";
          return currentPlayers;
        }
        assignedRole = "spectator";
        return currentPlayers;
      });
      return assignedRole;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Role assignment failed");
    }
  }
);

// --- Slice ---
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameData: (
      state,
      action: PayloadAction<Partial<GameState> & { gameId: string }>
    ) => {
      state.board = action.payload.board || Array(9).fill("");
      state.currentTurn = action.payload.currentTurn || "X";
      state.winner = action.payload.winner || "";
      state.players = action.payload.players || { X: null, O: null };
      state.gameId = action.payload.gameId;
      state.gameNotFound = false;
      state.isLoading = false;
    },
    setLocalPlayerRole: (
      state,
      action: PayloadAction<PlayerSymbol | "spectator" | null>
    ) => {
      state.localPlayerRole = action.payload;
    },
    setGameLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGameError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setGameNotFound: (state) => {
      state.gameNotFound = true;
      state.isLoading = false;
      state.gameId = null;
    },
    resetGame: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewGame.fulfilled, (state, action) => {
        state.gameId = action.payload;
        state.isLoading = false;
      })
      .addCase(createNewGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || "Failed to create game";
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.error =
          action.payload || action.error.message || "Failed to make move";
      })
      .addCase(assignPlayerRole.fulfilled, (state, action) => {
        state.localPlayerRole = action.payload;
      })
      .addCase(assignPlayerRole.rejected, (state, action) => {
        state.error =
          action.payload || action.error.message || "Failed to assign role";
      });
  },
});

export const {
  setGameData,
  setLocalPlayerRole,
  setGameLoading,
  setGameError,
  setGameNotFound,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
