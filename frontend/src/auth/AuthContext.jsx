import { createContext, useContext, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  });

  // POST /admins/sign_in -> o backend devolve o JWT no header "Authorization".
  async function login(email, password) {
    const res = await api.post("/admins/sign_in", {
      admin: { email, password },
    });

    // O devise-jwt manda o token no header Authorization ("Bearer xxx").
    const authHeader = res.headers["authorization"];
    if (!authHeader) {
      throw new Error("Token não retornado pelo servidor.");
    }

    localStorage.setItem("token", authHeader);
    localStorage.setItem("admin", JSON.stringify(res.data.admin));
    setToken(authHeader);
    setAdmin(res.data.admin);
  }

  // Obs.: o backend NÃO expõe cadastro via API (Admin sem :registerable).
  // Admins são criados por seed/console. Por isso o front só faz login.

  async function logout() {
    try {
      await api.delete("/admins/sign_out");
    } catch {
      // Se o servidor estiver fora, limpamos localmente mesmo assim.
    }
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
