import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import * as ModeCtx from "./context/ModeContext";
const Provider = ModeCtx.ModeProvider || ModeCtx.default || React.Fragment;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
