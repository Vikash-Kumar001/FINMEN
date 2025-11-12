import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
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
  </BrowserRouter>
);
