/** @format */

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />  
          <Route path="/game/:gameId" element={<Game />} />
          {/* Redirect /game (without :gameId) and all other invalid routes to home */}
          <Route path="/game" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
