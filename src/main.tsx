/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Your global styles
import { Provider } from "react-redux";
import { store } from "./store"; // Assuming your store setup
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext"; // Import ThemeProvider

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
