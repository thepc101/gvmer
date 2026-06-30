import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { installMockBridge } from "./lib/mock-bridge";
import "./styles/globals.css";

// Install mock API so the app works standalone in the browser (no Electron needed)
installMockBridge();

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
