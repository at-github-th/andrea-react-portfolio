import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import FuturistToggle from "./components/FuturistToggle.jsx";
// robust provider import (works whether default or named export)
import * as ModeCtx from "./context/ModeContext";
const Provider = ModeCtx.ModeProvider || ModeCtx.default || React.Fragment;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <App />
      <FuturistToggle />
  </Provider>
  </React.StrictMode>
);
