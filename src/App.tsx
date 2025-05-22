/** @format */

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";
// No need to import useTheme here directly if Navbar handles the toggle
// and ThemeProvider handles the class on <html>

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
