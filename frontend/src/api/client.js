import axios from "axios";
import { setConnStatus } from "../lib/connectionStatus";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// =============================================================================
// FASE 2 (protegida) - Cliente HTTP resiliente.
//   - TIMEOUT de 3s        -> nao trava esperando a API (Network Chaos).
//   - RETRY automatico      -> re-tenta GET ate 3x com 2s (Pod Kill).
//   - Deteccao de LENTIDAO  -> avisa a UI se passar de 2s sem resposta.
// (Cache local de fallback fica em ../lib/cache.js)
// =============================================================================
const TIMEOUT = 3000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const SLOW_AFTER = 2000;

const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  // Se a requisicao passar de 2s, sinaliza "conexao lenta" para a UI.
  config.__slowTimer = setTimeout(() => setConnStatus("slow"), SLOW_AFTER);
  return config;
});

function clearSlow(config) {
  if (config && config.__slowTimer) {
    clearTimeout(config.__slowTimer);
    config.__slowTimer = null;
  }
}

function isRetryable(error) {
  if (error.code === "ECONNABORTED") return true; // timeout
  if (!error.response) return true; // servidor fora do ar / erro de rede
  return error.response.status >= 500; // erro do servidor
}

api.interceptors.response.use(
  (response) => {
    clearSlow(response.config);
    setConnStatus("ok");
    return response;
  },
  async (error) => {
    const config = error.config || {};
    clearSlow(config);

    const method = (config.method || "get").toLowerCase();
    config.__retryCount = config.__retryCount || 0;

    // Re-tentamos automaticamente apenas GET (idempotente). Repetir POST/DELETE
    // poderia duplicar dados - esse caso e tratado na UI (o usuario reenvia).
    if (method === "get" && isRetryable(error) && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      setConnStatus("retrying");
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return api(config);
    }

    if (!error.response) {
      setConnStatus("offline");
    }
    return Promise.reject(error);
  }
);

export default api;
