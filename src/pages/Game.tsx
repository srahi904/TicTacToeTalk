/** @format */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  makeMove,
  setGameData,
  setLocalPlayerRole,
  setGameLoading,
  setGameError,
  PlayerSymbol,
  setGameNotFound,
  resetGame,
} from "@/features/game/gameSlice";
import { clearChatMessages, resetChat } from "@/features/chat/chatSlice";
import { database } from "@/lib/firebase";
import { ref, onValue, off, update } from "firebase/database";
import { usePlayerId } from "@/hooks/usePlayerId";
import Board from "@/components/Board";
import WinnerConfetti from "@/components/WinnerConfetti";
import ChatWindow from "@/components/ChatWindow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { motion } from "framer-motion";

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const persistentPlayerId = usePlayerId();

  const {
    board,
    currentTurn,
    winner,
    players,
    localPlayerRole,
    isLoading,
    error,
    gameNotFound,
  } = useSelector((state: RootState) => state.game);

  const [showConfetti, setShowConfetti] = useState(false);
  const { status: copyStatus, copy } = useCopyToClipboard();
  const shareUrl = gameId ? `${window.location.origin}/game/${gameId}` : "";

  useEffect(() => {
    dispatch(setGameLoading(true));
    dispatch(clearChatMessages());
    return () => {
      dispatch(resetGame());
      dispatch(resetChat());
    };
  }, [gameId, dispatch]);

  useEffect(() => {
    if (!gameId || !persistentPlayerId) return;
    dispatch(setGameLoading(true));
    const gameRef = ref(database, `games/${gameId}`);
    const unsubscribe = onValue(
      gameRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          dispatch(setGameNotFound());
          return;
        }
        const gameDataFromFb = {
          gameId,
          board: data.board,
          currentTurn: data.currentTurn,
          winner: data.winner,
          players: data.players || { X: null, O: null },
        };
        dispatch(setGameData(gameDataFromFb));
        // Assign local player role
        const currentPlayers = data.players || { X: null, O: null };
        let assignedRole: PlayerSymbol | "spectator" | null = "spectator";
        if (currentPlayers.X === persistentPlayerId) assignedRole = "X";
        else if (currentPlayers.O === persistentPlayerId) assignedRole = "O";
        else if (!currentPlayers.X) {
          update(ref(database, `games/${gameId}/players`), {
            X: persistentPlayerId,
          });
          assignedRole = "X";
        } else if (!currentPlayers.O) {
          update(ref(database, `games/${gameId}/players`), {
            O: persistentPlayerId,
          });
          assignedRole = "O";
        }
        dispatch(setLocalPlayerRole(assignedRole));
        dispatch(setGameLoading(false));
      },
      (_err) => {
        dispatch(setGameError("Failed to connect to game."));
        dispatch(setGameLoading(false));
      }
    );
    return () => {
      off(gameRef, "value", unsubscribe);
    };
  }, [gameId, dispatch, persistentPlayerId]);

  useEffect(() => {
    if (winner && winner !== "draw") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleCellClick = async (idx: number) => {
    if (
      !gameId ||
      !localPlayerRole ||
      localPlayerRole === "spectator" ||
      winner ||
      board[idx] !== "" ||
      currentTurn !== localPlayerRole
    ) {
      return;
    }
    try {
      await dispatch(makeMove({ gameId, position: idx })).unwrap();
    } catch (err: any) {
      dispatch(setGameError(err.message || "Move failed"));
    }
  };

  const handleRestartGame = async () => {
    if (!gameId) return;
    const newBoard = Array(9).fill("");
    const initialGameData = {
      board: newBoard,
      currentTurn: "X" as PlayerSymbol,
      winner: "",
      players: { X: players.X, O: players.O },
    };
    await update(ref(database, `games/${gameId}`), initialGameData);
    setShowConfetti(false);
  };

  if (gameNotFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <motion.h2
          className="text-3xl font-bold text-accent mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          Game Not Found
        </motion.h2>
        <p className="text-gray-600 mb-6">
          The game ID "{gameId}" does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (isLoading && !board.some((cell) => cell !== "")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-2xl text-primary font-semibold">
        Loading game...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <p className="text-2xl text-accent">Error: {error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-primary text-white py-2 px-4 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const canPlay =
    localPlayerRole !== "spectator" &&
    !winner &&
    currentTurn === localPlayerRole;

  return (
    <div className="pt-20 min-h-screen bg-gradient-radial from-primary/10 via-secondary/10 to-background flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 px-4 py-10">
      <WinnerConfetti fire={showConfetti} />
      <motion.div
        className="flex flex-col items-center space-y-6 glass p-6 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <header className="text-center w-full">
          <div className="flex flex-col items-center gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Game ID: <span className="text-secondary">{gameId}</span>
              </h2>
            </div>
            <div className="relative flex flex-row justify-between items-center w-full max-w-xs md:max-w-md mx-auto">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full py-3 pl-4 pr-12 rounded-xl border border-primary/30 dark:border-lavender/30 bg-white/60 dark:bg-navy/70 shadow-glass text-primary dark:text-lavender font-medium text-center text-base md:text-lg backdrop-blur-md transition-all duration-200 focus:ring-2 focus:ring-primary/40 dark:focus:ring-lavender/40 outline-none"
              />
              <button
                onClick={() => copy(shareUrl)}
                className="p-2 text-gray-500 hover:text-primary transition-colors"
                aria-label="Copy game link"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            {copyStatus === "success" && (
              <span className="ml-2 text-green-600 text-sm">Copied!</span>
            )}
            {copyStatus === "error" && (
              <span className="ml-2 text-accent text-sm">Failed to copy</span>
            )}
          </div>
          <p className="text-md text-gray-600">
            You are:{" "}
            <span
              className={`font-bold ${
                localPlayerRole === "X"
                  ? "text-primary"
                  : localPlayerRole === "O"
                  ? "text-secondary"
                  : "text-gray-500 italic"
              }`}
            >
              {localPlayerRole
                ? localPlayerRole.toUpperCase()
                : "Connecting..."}
              {localPlayerRole === "spectator" && " (Spectator)"}
            </span>
          </p>
        </header>
        <Board
          board={board}
          onCellClick={handleCellClick}
          disabled={!canPlay}
          localPlayerRole={localPlayerRole}
          currentTurn={currentTurn}
          winner={winner}
        />
        <div className="text-center w-full max-w-xs md:max-w-sm">
          {winner ? (
            <>
              <motion.p
                className={`mt-4 text-2xl md:text-3xl font-semibold ${
                  winner === "draw" ? "text-gray-700" : "text-accent"
                }`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {winner === "draw" ? "It's a Draw!" : `Winner: ${winner}!`}
              </motion.p>
              <motion.button
                onClick={handleRestartGame}
                className="mt-4 bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
                whileTap={{ scale: 0.97 }}
              >
                Play Again?
              </motion.button>
            </>
          ) : (
            <motion.p
              className="mt-4 text-xl md:text-2xl font-medium text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Current Turn:{" "}
              <span
                className={
                  currentTurn === "X"
                    ? "text-primary font-bold"
                    : "text-secondary font-bold"
                }
              >
                {currentTurn}
              </span>
            </motion.p>
          )}
          {!winner && !canPlay && localPlayerRole !== "spectator" && (
            <p className="mt-2 text-md text-gray-500">
              Waiting for opponent's turn...
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Leave Game
        </button>
      </motion.div>
      {gameId && (
        <motion.div
          className="w-full lg:w-auto lg:max-w-md mt-8 lg:mt-0 animate-fade-in"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ChatWindow gameId={gameId} localPlayerRole={localPlayerRole} />
        </motion.div>
      )}
    </div>
  );
}
