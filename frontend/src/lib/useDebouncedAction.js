import { useState, useRef, useCallback } from "react";

// =============================================================================
// FASE 2 (protegida) - Debounce / anti-duplo-clique em botoes de acao.
// Impede que o usuario dispare N requisicoes clicando varias vezes num servidor
// ja sobrecarregado. O botao fica desabilitado durante a requisicao e por mais
// `cooldown` ms depois de concluida.
// =============================================================================
export function useDebouncedAction(fn, cooldown = 2000) {
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  const run = useCallback(
    async (...args) => {
      if (lock.current) return;
      lock.current = true;
      setBusy(true);
      try {
        await fn(...args);
      } finally {
        setTimeout(() => {
          lock.current = false;
          setBusy(false);
        }, cooldown);
      }
    },
    [fn, cooldown]
  );

  return [run, busy];
}
