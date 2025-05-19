/** @format */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="w-full px-4 md:px-8 py-3 glass bg-gradient-to-r from-primary/10 via-white/70 to-secondary/10 dark:from-navy/70 dark:via-navy/90 dark:to-lavender/10 shadow-glass border-b border-primary/10 dark:border-lavender/20 fixed top-0 left-0 z-40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none">
          <motion.span
            className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-lavender bg-clip-text text-transparent tracking-tight"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            TicTacTalk
          </motion.span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-lg font-semibold px-4 py-2 rounded transition-colors
              ${
                location.pathname === "/"
                  ? "bg-primary text-white dark:bg-lavender dark:text-navy"
                  : "text-primary hover:bg-primary/10 dark:text-lavender dark:hover:bg-lavender/10"
              }
            `}
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
