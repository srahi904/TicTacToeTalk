/** @format */

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

interface WinnerConfettiProps {
  fire: boolean;
}

const WinnerConfetti: React.FC<WinnerConfettiProps> = ({ fire }) => {
  const { width, height } = useWindowSize();
  if (!fire || width === null || height === null) return null;
  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={350}
      gravity={0.25}
      initialVelocityY={20}
      tweenDuration={3600}
      colors={["#2563eb", "#06b6d4", "#a78bfa", "#f43f5e", "#4caf50"]}
    />
  );
};

export default WinnerConfetti;
