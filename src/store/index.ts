/** @format */

import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/game/gameSlice";
import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
