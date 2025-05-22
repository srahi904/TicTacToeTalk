/** @format */

import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import EmojiPicker, {
  EmojiClickData,
  Theme,
  EmojiStyle,
} from "emoji-picker-react";
import { useTheme } from "@/contexts/ThemeContext";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPickerButton: FC<EmojiPickerButtonProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme(); // Get current theme

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 text-gray-500 dark:text-dm-muted hover:text-primary dark:hover:text-dm-primary rounded-full hover:bg-gray-100 dark:hover:bg-dm-surface transition-colors"
        aria-label="Add emoji"
      >
        😊 {/* Consider using an icon that adapts to theme or is neutral */}
      </button>
      {showPicker && (
        <div className=" absolute bottom-full right-0 mb-2 z-20">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
            emojiStyle={EmojiStyle.NATIVE}
            height={350}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
