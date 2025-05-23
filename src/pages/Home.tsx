/** @format */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createNewGame, resetGame } from "@/features/game/gameSlice";
import { resetChat } from "@/features/chat/chatSlice";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
// No need for useTheme here if sub-components handle their own theming or global styles apply

function generateGameId(): string {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  let result = "";
  for (let i = 0; i < 6; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export default function Home() {
  const [joinGameId, setJoinGameId] = useState("");
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { status: copyStatus, copy } = useCopyToClipboard();

  const handleCreateGame = async () => {
    dispatch(resetGame());
    dispatch(resetChat());
    const newGameId = generateGameId();
    // setCreatedGameId(newGameId); // Navigate immediately, so this might not be seen unless navigation fails
    try {
      await dispatch(createNewGame(newGameId)).unwrap();
      navigate(`/game/${newGameId}`);
    } catch (error) {
      console.error("Error creating game:", error); // Log error
      alert("Error creating game. Please try again.");
      setCreatedGameId(null); // Clear if creation failed
    }
  };

  const handleJoinGame = () => {
    if (joinGameId.trim().length !== 6) {
      alert("Please enter a valid 6-character game ID.");
      return;
    }
    dispatch(resetGame());
    dispatch(resetChat());
    navigate(`/game/${joinGameId.toUpperCase().trim()}`);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-radial from-primary/10 via-secondary/10 to-background dark:from-dm-primary/10 dark:via-dm-secondary/10 dark:to-dm-base flex flex-col items-center justify-center font-sans px-4">
      <motion.header
        className="mb-10 text-center"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary dark:text-dm-primary mb-3 tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-primary via-secondary to-dm-secondary dark:from-dm-primary dark:via-dm-secondary dark:to-secondary bg-clip-text text-transparent">
            Tic Tac Toe Online
          </span>
        </h1>
        <p className="pt-2 text-lg md:text-xl text-gray-600 dark:text-gray-700 font-medium">
          Tic. Tac. Talk. Play the game, drop the emojis!
          <br />
          Play with friends in real-time!
        </p>
      </motion.header>

      <motion.div
        className="glass p-8 rounded-3xl shadow-2xl w-full max-w-sm space-y-7 animate-fade-in" // Glass class handles dark mode
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
      >
        <motion.button
          onClick={handleCreateGame}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary dark:from-dm-primary dark:to-dm-secondary dark:hover:from-dm-secondary dark:hover:to-dm-primary text-white dark:text-textLight font-semibold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dm-primary"
          whileTap={{ scale: 0.97 }}
        >
          Create New Game
        </motion.button>
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-dm-muted"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-dm-muted">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-dm-muted"></div>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            maxLength={6}
            value={joinGameId}
            onChange={(e) => setJoinGameId(e.target.value.toUpperCase())}
            placeholder="Enter Game Code (e.g. ABC123)"
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-dm-muted text-center uppercase text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dm-secondary bg-white dark:bg-dm-surface text-textDark dark:text-dm-text"
          />
          <motion.button
            onClick={handleJoinGame}
            className="w-full bg-gradient-to-r from-secondary to-dm-secondary hover:from-dm-secondary hover:to-secondary dark:from-dm-secondary dark:to-primary dark:hover:from-primary dark:hover:to-dm-secondary text-textDark dark:text-textLight font-semibold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dm-secondary"
            disabled={joinGameId.length !== 6}
            whileTap={{ scale: 0.97 }}
          >
            Join Game
          </motion.button>
        </div>
      </motion.div>

      {createdGameId && ( // This section might not be very useful if navigate happens immediately
        <motion.div
          className="mt-8 p-4 glass rounded-xl w-full max-w-sm text-center animate-fade-in" // Glass class
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-2 text-gray-700 dark:text-dm-text font-semibold">
            Share this game with a friend:
          </p>
          <div className="flex items-center gap-2 justify-center">
            <input
              type="text"
              value={`${window.location.origin}/game/${createdGameId}`}
              readOnly
              className="flex-1 p-2 border rounded-lg bg-gray-100 dark:bg-dm-surface dark:border-dm-muted dark:text-dm-text text-sm"
            />
            <button
              onClick={() =>
                copy(`${window.location.origin}/game/${createdGameId}`)
              }
              className="p-2 text-gray-600 dark:text-dm-muted hover:text-primary dark:hover:text-dm-primary"
              aria-label="Copy game link"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            <div className="mt-1 text-green dark:text-green-400 text-sm">
              Link copied!
            </div>
          )}
          {copyStatus === "error" && (
            <div className="mt-1 text-accent dark:text-red-500 text-sm">
              Failed to copy
            </div>
          )}
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
