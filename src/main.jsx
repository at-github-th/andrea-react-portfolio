import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ModeProvider, { useMode } from "./context/ModeContext.jsx";
import FuturistToggle from "./components/FuturistToggle.jsx";
import FuturistLayout from "./futurist/FuturistLayout.jsx";
function Root(){ const { futurist } = useMode(); return (<>{futurist ? <FuturistLayout/> : <App/>}<FuturistToggle/></>); }
ReactDOM.createRoot(document.getElementById("root")).render(
import { hideProfileDiagram } from "./utils/hideProfileDiagram.js";
  <React.StrictMode>
    <ModeProvider>
      <Root />
    </ModeProvider>
  </React.StrictMode>
);

