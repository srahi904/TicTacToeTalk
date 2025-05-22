/** @format */

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  sendMessage,
  ChatMessage,
  addMessage,
} from "@/features/chat/chatSlice";
import { usePlayerId } from "@/hooks/usePlayerId";
import EmojiPickerButton from "./EmojiPickerButton";
import { PlayerSymbol } from "@/features/game/gameSlice";
import { database } from "@/lib/firebase";
import {
  ref,
  onChildAdded,
  off,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { motion } from "framer-motion";

interface ChatWindowProps {
  gameId: string;
  localPlayerRole: PlayerSymbol | "spectator" | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ gameId, localPlayerRole }) => {
  const dispatch: AppDispatch = useDispatch();
  const playerId = usePlayerId();
  const messages = useSelector(
    (state: RootState) => state.chat.currentGamIdMessages
  );
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = ref(database, `chats/${gameId}/messages`);
    const messagesQuery = query(
      messagesRef,
      orderByChild("serverTimestamp"),
      limitToLast(50)
    );
    const handleNewMessage = (snapshot: any) => {
      const msgData = snapshot.val();
      if (msgData) {
        const chatMsg: ChatMessage = {
          id: snapshot.key!,
          gameId: msgData.gameId || gameId,
          senderId: msgData.senderId,
          senderRole: msgData.senderRole,
          text: msgData.text,
          timestamp: msgData.timestamp,
        };
        dispatch(addMessage(chatMsg));
      }
    };
    onChildAdded(messagesQuery, handleNewMessage);
    return () => {
      off(messagesQuery, "child_added", handleNewMessage);
    };
  }, [gameId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && playerId) {
      dispatch(
        sendMessage({
          gameId,
          senderId: playerId,
          senderRole: localPlayerRole || "Unknown",
          text: newMessage,
        })
      );
      setNewMessage("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  return (
    <motion.div
      // ChatWindow also uses 'glass' class for its background
      className="w-full max-w-md h-[500px] flex flex-col p-4 rounded-2xl shadow-xl glass animate-fade-in transition-smooth" // Added transition-smooth
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-primary dark:text-dm-primary mb-3 border-b border-gray-300 dark:border-dm-muted pb-2 transition-smooth">
        Game Chat
      </h3>

      <div className="flex-grow overflow-y-auto space-y-3 pr-1 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === playerId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 flex gap-2 justify-between items-center flex-wrap rounded-2xl shadow-md text-sm max-w-[80%] break-words overflow-hidden transition-smooth ${
                msg.senderId === playerId
                  ? "bg-primary text-white dark:bg-dm-primary dark:text-textLight rounded-br-none"
                  : "bg-gray-200 text-gray-800 dark:bg-dm-surface dark:text-dm-text rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words break-all">
                {msg.text.trim()}
              </p>
              <p className="text-[10px] opacity-60 dark:opacity-70 text-right mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 border-t border-gray-200 dark:border-dm-muted pt-3 transition-smooth"
      >
        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-3 py-2 rounded-xl bg-white dark:bg-dm-base border border-gray-300 dark:border-dm-muted focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dm-primary text-sm text-textDark dark:text-dm-text transition-smooth"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-blue-600 dark:bg-dm-primary dark:hover:bg-dm-primary/80 text-white dark:text-textLight px-4 py-2 rounded-xl font-semibold text-sm transition-smooth"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
};

export default ChatWindow;
