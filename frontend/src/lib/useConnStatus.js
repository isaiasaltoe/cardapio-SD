import { useSyncExternalStore } from "react";
import { subscribeConn, getConnStatus } from "./connectionStatus";

// Hook React que reflete o status de conexao com a API em tempo real.
export function useConnStatus() {
  return useSyncExternalStore(subscribeConn, getConnStatus);
}
