import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import ConnectionBanner from "./components/ConnectionBanner";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* FASE 2: aviso global de conexao (lenta / re-tentando / offline) */}
        <ConnectionBanner />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
