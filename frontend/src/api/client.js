import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// =============================================================================
// FASE 1 - VERSAO VULNERAVEL (sem protecoes de resiliencia)
// =============================================================================
// Este cliente e proposital e deliberadamente "cru":
//   - SEM timeout        -> se a API travar (Network Chaos), o front fica preso.
//   - SEM retry          -> se a API cair (Pod Kill), a requisicao falha na hora.
//   - SEM cache/fallback  -> nada de localStorage; se cair, a tela fica vazia.
//
// Na FASE 2 (protegida) e aqui que entram: `timeout`, interceptor de retry
// e fallback via cache local (ver guia_de_protecoes.md).
// =============================================================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta o token JWT (salvo no login) em toda requisicao autenticada.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
