import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

// Capture beforeinstallprompt event early (before React components mount)
// This ensures we don't miss the event if it fires before the InstallPWA component loads
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("🔔 beforeinstallprompt event captured globally");
  e.preventDefault();
  // Store globally so InstallPWA component can access it
  window.deferredInstallPrompt = e;
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <WalletProvider>
          <NotificationProvider>
            <SocketProvider>
              <SubscriptionProvider>
                <App />
              </SubscriptionProvider>
            </SocketProvider>
          </NotificationProvider>
        </WalletProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
