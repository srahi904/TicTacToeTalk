/** @format */

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
// To make confetti colors themeable, you could import useTheme and adjust colors array
// import { useTheme } from "@/context/ThemeContext";

interface WinnerConfettiProps {
  fire: boolean;
}

const WinnerConfetti: React.FC<WinnerConfettiProps> = ({ fire }) => {
  const { width, height } = useWindowSize();
  // const { theme } = useTheme(); // Uncomment if you want to change colors based on theme

  if (!fire || width === null || height === null) return null;

  // Example: Dynamic colors (optional)
  // const confettiColors = theme === 'dark'
  //   ? ["#818cf8", "#c084fc", "#f472b6", "#4ade80", "#38bdf8"] // Dark theme friendly colors
  //   : ["#2563eb", "#06b6d4", "#a78bfa", "#f43f5e", "#4caf50"]; // Original colors

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={350}
      gravity={0.25}
      initialVelocityY={20}
      tweenDuration={3600}
      colors={["#2563eb", "#06b6d4", "#a78bfa", "#f43f5e", "#4caf50"]} // Using original colors, or replace with confettiColors
    />
  );
};

export default WinnerConfetti;
