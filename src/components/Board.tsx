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
      "h-20 w-20 md:h-28 md:w-28 text-5xl md:text-6xl font-extrabold rounded-xl flex items-center justify-center shadow-inner transition-all duration-150 ease-in-out select-none";
    if (cell === "X") classes += " text-primary cell-animation-x";
    else if (cell === "O") classes += " text-secondary cell-animation-o";
    else {
      classes += " text-gray-400 bg-white/70";
      if (
        !disabled &&
        localPlayerRole !== "spectator" &&
        currentTurn === localPlayerRole &&
        !winner
      )
        classes += " hover:bg-primary/10 cursor-pointer";
      else classes += " cursor-not-allowed";
    }
    return classes;
  };

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 w-[300px] h-[300px] md:w-[340px] md:h-[340px] border-4 border-primary rounded-2xl p-3 bg-surface shadow-2xl glass animate-fade-in"
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
