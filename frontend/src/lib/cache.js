// =============================================================================
// FASE 2 (protegida) - Cache local (localStorage) como fallback.
// Se a API cair (ex: Pod Kill) e nao houver como buscar dados frescos,
// exibimos a ultima copia salva com um aviso "dados da ultima atualizacao".
// =============================================================================
const PREFIX = "cache:";

export function readCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, at: Date.now() }));
  } catch {
    // localStorage cheio/indisponivel: ignora, cache e best-effort.
  }
}

// Faz um GET usando o cliente axios (que ja tem timeout + retry).
// - Sucesso: atualiza o cache e devolve os dados frescos.
// - Falha (apos os retries): devolve a ultima copia salva marcando fromCache.
//   Se nao houver copia, propaga o erro.
export async function getWithCache(api, url) {
  try {
    const res = await api.get(url);
    writeCache(url, res.data);
    return { data: res.data, fromCache: false, cachedAt: Date.now() };
  } catch (err) {
    const cached = readCache(url);
    if (cached) {
      return { data: cached.data, fromCache: true, cachedAt: cached.at };
    }
    throw err;
  }
}
