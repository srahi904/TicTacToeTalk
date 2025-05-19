/** @format */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { database } from "@/lib/firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";
import { PlayerSymbol } from "../game/gameSlice";

export interface ChatMessage {
  id: string;
  gameId: string;
  senderId: string;
  senderRole?: PlayerSymbol | "spectator" | string;
  text: string;
  timestamp: number;
  emoji?: string;
}

export interface ChatState {
  messagesByGameId: Record<string, ChatMessage[]>;
  currentGamIdMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messagesByGameId: {},
  currentGamIdMessages: [],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      gameId,
      senderId,
      senderRole,
      text,
    }: Omit<ChatMessage, "id" | "timestamp">,
    { rejectWithValue }
  ) => {
    if (!text.trim()) {
      return rejectWithValue("Message cannot be empty.");
    }
    const messageData = {
      gameId,
      senderId,
      senderRole,
      text,
      timestamp: Date.now(),
      serverTimestamp: serverTimestamp(),
    };
    try {
      const messagesRef = ref(database, `chats/${gameId}/messages`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageData);
      return { ...messageData, id: newMessageRef.key! };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { gameId } = action.payload;
      if (!state.messagesByGameId[gameId]) {
        state.messagesByGameId[gameId] = [];
      }
      if (
        !state.messagesByGameId[gameId].find(
          (msg) => msg.id === action.payload.id
        )
      ) {
        state.messagesByGameId[gameId].push(action.payload);
        state.messagesByGameId[gameId].sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }
      if (
        state.currentGamIdMessages.length === 0 ||
        state.currentGamIdMessages[0]?.gameId === gameId
      ) {
        if (
          !state.currentGamIdMessages.find(
            (msg) => msg.id === action.payload.id
          )
        ) {
          state.currentGamIdMessages.push(action.payload);
          state.currentGamIdMessages.sort((a, b) => a.timestamp - b.timestamp);
        }
      }
    },
    loadMessagesForGame: (
      state,
      action: PayloadAction<{ gameId: string; messages: ChatMessage[] }>
    ) => {
      state.messagesByGameId[action.payload.gameId] =
        action.payload.messages.sort((a, b) => a.timestamp - b.timestamp);
      state.currentGamIdMessages = [
        ...state.messagesByGameId[action.payload.gameId],
      ];
    },
    clearChatMessages: (state) => {
      state.currentGamIdMessages = [];
    },
    resetChat: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send message";
      });
  },
});

export const { addMessage, loadMessagesForGame, clearChatMessages, resetChat } =
  chatSlice.actions;
export default chatSlice.reducer;
