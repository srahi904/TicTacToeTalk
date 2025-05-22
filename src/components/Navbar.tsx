/** @format */

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { FiSun, FiMoon } from "react-icons/fi"; // Example icons

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full px-4 md:px-8 py-3 glass bg-gradient-to-r from-primary/10 via-white/70 to-secondary/10 dark:from-dm-surface/70 dark:via-dm-surface/90 dark:to-dm-secondary/10 shadow-glass border-b border-primary/10 dark:border-dm-muted/20 fixed top-0 left-0 z-40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none">
          <motion.span
            className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-dm-secondary dark:from-dm-primary dark:via-dm-secondary dark:to-secondary bg-clip-text text-transparent tracking-tight"
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
            className={`text-lg font-semibold px-4 py-2 rounded-md transition-colors
              ${
                location.pathname === "/"
                  ? "bg-primary text-white dark:bg-dm-primary dark:text-textLight"
                  : "text-primary hover:bg-primary/10 dark:text-dm-secondary dark:hover:bg-dm-secondary/20"
              }
            `}
          >
            Home
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-primary dark:text-dm-secondary hover:bg-secondary/20 dark:hover:bg-dm-secondary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon size={22} /> : <FiSun size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
