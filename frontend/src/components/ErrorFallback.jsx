// FASE 2 (protegida) - Fallback visual amigavel.
// Mostrado quando, mesmo apos os retries, nao conseguimos carregar os dados
// E nao ha copia local no cache. Evita telas de erro cru (502/timeout).
export default function ErrorFallback({ onRetry }) {
  return (
    <div className="card error-fallback">
      <div className="error-emoji" aria-hidden="true">🍽️</div>
      <h2>Estamos voltando em instantes</h2>
      <p className="muted">
        Nao foi possivel carregar o cardapio e nao ha uma copia salva neste
        dispositivo. O servidor pode estar se recuperando.
      </p>
      <button onClick={onRetry}>Tentar novamente</button>
    </div>
  );
}
