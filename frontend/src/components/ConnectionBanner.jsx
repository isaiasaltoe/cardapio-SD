import { useConnStatus } from "../lib/useConnStatus";

// FASE 2 (protegida) - Banner fixo no topo avisando o estado da conexao.
// Aparece so quando NAO esta "ok" e some sozinho quando a API volta.
const MENSAGENS = {
  slow: "Conexao lenta. Tentando carregar...",
  retrying: "Servidor instavel. Tentando novamente...",
  offline: "Sem conexao com o servidor. Reconectando...",
};

export default function ConnectionBanner() {
  const status = useConnStatus();
  if (status === "ok") return null;

  return (
    <div className={`conn-banner conn-${status}`} role="status">
      <span className="conn-dot" />
      {MENSAGENS[status]}
    </div>
  );
}
