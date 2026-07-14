// =============================================================================
// FASE 2 (protegida) - Status global de conexao com a API.
// Pub/sub minimalista consumido pelo <ConnectionBanner /> para avisar o usuario
// quando a rede esta lenta, quando estamos re-tentando ou quando caiu.
// Estados: "ok" | "slow" | "retrying" | "offline"
// =============================================================================
let status = "ok";
const listeners = new Set();

export function getConnStatus() {
  return status;
}

export function setConnStatus(next) {
  if (next === status) return;
  status = next;
  listeners.forEach((l) => l(status));
}

export function subscribeConn(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
