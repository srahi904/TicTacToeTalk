/** @format */

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Corrected import based on usage

export default function Footer() {
  return (
    <footer className="mt-16 mb-4 flex flex-col items-center justify-center">
      <div className="glass bg-gradient-to-r from-primary/10 via-white/70 to-secondary/10 dark:from-dm-primary/10 dark:via-dm-surface/70 dark:to-dm-secondary/10 rounded-2xl px-6 py-4 shadow-glass flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <p className="text-gray-700 dark:text-dm-muted text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-primary dark:text-aesthetic-periwinkle">
            Tic Tac Toe Masters Inc.
          </span>{" "}
          All rights reserved.
        </p>
        <div className="flex gap-3">
          <a
            href="https://github.com/srahi904"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full bg-white/70 dark:bg-dm-surface/80 p-2 transition-all duration-200 shadow hover:scale-110 hover:bg-primary hover:text-white dark:hover:bg-dm-primary dark:hover:text-textLight"
            aria-label="GitHub"
          >
            <FaGithub className="h-6 w-6" />
          </a>
          <a
            href="https://x.com/srahi904"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full bg-white/70 dark:bg-dm-surface/80 p-2 transition-all duration-200 shadow hover:scale-110 hover:bg-primary hover:text-white dark:hover:bg-dm-primary dark:hover:text-textLight"
            aria-label="Twitter"
          >
            <FaXTwitter className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/srahi904/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full bg-white/70 dark:bg-dm-surface/80 p-2 transition-all duration-200 shadow hover:scale-110 hover:bg-primary hover:text-white dark:hover:bg-dm-primary dark:hover:text-textLight"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
