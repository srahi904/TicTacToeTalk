/** @format */

import React from "react";
import { BoardState, CellState, PlayerSymbol } from "@/features/game/gameSlice";
import { motion } from "framer-motion";

interface BoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  disabled: boolean;
  localPlayerRole: PlayerSymbol | "spectator" | null;
  currentTurn: PlayerSymbol;
  winner: PlayerSymbol | "draw" | "";
}

const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  disabled,
  localPlayerRole,
  currentTurn,
  winner,
}) => {
  const getCellClasses = (cell: CellState) => {
    let classes =
      "h-20 w-20 md:h-28 md:w-28 text-5xl md:text-6xl font-extrabold rounded-xl flex items-center justify-center shadow-inner select-none transition-smooth";

    if (cell === "X")
      classes += " text-primary dark:text-aesthetic-sunrise cell-animation-x";
    else if (cell === "O")
      classes += " text-secondary dark:text-dm-secondary cell-animation-o";
    else {
      classes +=
        " text-gray-400 dark:text-dm-muted bg-white/40 dark:bg-dm-surface/30"; //
      if (
        !disabled &&
        localPlayerRole !== "spectator" &&
        currentTurn === localPlayerRole &&
        !winner
      )
        classes +=
          " hover:bg-primary/10 dark:hover:bg-dm-primary/20 cursor-pointer";
      else classes += " cursor-not-allowed opacity-70 dark:opacity-60";
    }
    return classes;
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] border-4 border-primary dark:border-dm-primary rounded-2xl p-3 shadow-2xl glass animate-fade-in transition-smooth"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
    >
      {board.map((cell, idx) => (
        <button
          key={idx}
          onClick={() => onCellClick(idx)}
          disabled={
            disabled ||
            cell !== "" ||
            localPlayerRole === "spectator" ||
            currentTurn !== localPlayerRole ||
            !!winner
          }
          className={getCellClasses(cell)}
          aria-label={`Cell ${idx + 1}, value ${cell || "empty"}`}
        >
          {cell}
        </button>
      ))}
    </motion.div>
  );
};

export default Board;
