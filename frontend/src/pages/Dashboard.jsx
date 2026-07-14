import { useEffect, useState } from "react";
import api from "../api/client";
import { getWithCache } from "../lib/cache";
import { useDebouncedAction } from "../lib/useDebouncedAction";
import { useAuth } from "../auth/AuthContext";
import { CategoriasSkeleton, ItensSkeleton } from "../components/Skeleton";
import ErrorFallback from "../components/ErrorFallback";

export default function Dashboard() {
  const { admin, logout } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroTotal, setErroTotal] = useState(false); // falha total no load (sem cache)
  const [erroAcao, setErroAcao] = useState(""); // falha numa acao pontual (criar/excluir)
  const [cacheInfo, setCacheInfo] = useState(null); // { at } quando exibindo dados do cache
  const [excluindoId, setExcluindoId] = useState(null);

  const [novaCategoria, setNovaCategoria] = useState("");
  const [item, setItem] = useState({
    name: "",
    description: "",
    value: "",
    category_id: "",
  });

  // ---------------------------------------------------------------------------
  // FASE 2 (protegida) - carregamento com retry (no axios) + cache local.
  //  - Skeleton screen enquanto carrega (nada de tela em branco).
  //  - Se a API cair mas houver copia no localStorage: exibe os dados salvos
  //    com aviso "dados da ultima atualizacao".
  //  - Se cair e nao houver cache: tela de fallback amigavel (ErrorFallback).
  // ---------------------------------------------------------------------------
  async function carregarTudo({ silent = false } = {}) {
    if (!silent) {
      setCarregando(true);
      setErroTotal(false);
    }
    try {
      const [cat, it] = await Promise.all([
        getWithCache(api, "/api/v1/categories"),
        getWithCache(api, "/api/v1/items"),
      ]);
      setCategorias(cat.data);
      setItens(it.data);
      const usandoCache = cat.fromCache || it.fromCache;
      setCacheInfo(usandoCache ? { at: Math.min(cat.cachedAt, it.cachedAt) } : null);
      setErroTotal(false);
    } catch {
      if (silent) {
        setErroAcao("Nao foi possivel atualizar a lista. Tente novamente.");
      } else {
        setErroTotal(true);
      }
    } finally {
      if (!silent) setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  // Debounce nos botoes de criar (anti-duplo-clique / anti-spam).
  const [criarCategoria, criandoCategoria] = useDebouncedAction(async () => {
    const nome = novaCategoria.trim();
    if (!nome) return;
    setErroAcao("");
    try {
      await api.post("/api/v1/categories", { category: { name: nome } });
      setNovaCategoria("");
      await carregarTudo({ silent: true });
    } catch {
      setErroAcao("Falha ao criar categoria. Tente novamente.");
    }
  });

  const [criarItem, criandoItem] = useDebouncedAction(async () => {
    if (!item.name.trim()) return;
    setErroAcao("");
    try {
      await api.post("/api/v1/items", {
        item: {
          name: item.name,
          description: item.description,
          value: parseFloat(item.value) || 0,
          category_id: item.category_id || null,
        },
      });
      setItem({ name: "", description: "", value: "", category_id: "" });
      await carregarTudo({ silent: true });
    } catch {
      setErroAcao("Falha ao criar item. Confira os campos e tente novamente.");
    }
  });

  async function excluir(tipo, id) {
    if (excluindoId) return; // ja tem uma exclusao em andamento
    setExcluindoId(`${tipo}-${id}`);
    setErroAcao("");
    try {
      await api.delete(`/api/v1/${tipo}/${id}`);
      await carregarTudo({ silent: true });
    } catch {
      setErroAcao("Falha ao excluir. Tente novamente.");
    } finally {
      setExcluindoId(null);
    }
  }

  function nomeCategoria(id) {
    const c = categorias.find((c) => c.id === id);
    return c ? c.name : "-";
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Cardapio Admin</strong>
          <span className="muted"> - {admin?.email}</span>
        </div>
        <div className="topbar-actions">
          <button className="ghost" onClick={() => carregarTudo()}>
            Recarregar
          </button>
          <button className="ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="container">
        {/* Aviso de dados vindos do cache local (API indisponivel) */}
        {cacheInfo && (
          <div className="cache-banner">
            Exibindo dados salvos (ultima atualizacao{" "}
            {new Date(cacheInfo.at).toLocaleTimeString()}). O servidor esta se
            recuperando.
          </div>
        )}

        {erroAcao && <div className="erro banner">{erroAcao}</div>}

        {carregando ? (
          // FASE 2: skeleton screens imitando o layout real
          <div className="grid">
            <section className="card">
              <h2>Categorias</h2>
              <CategoriasSkeleton />
            </section>
            <section className="card">
              <h2>Itens do cardapio</h2>
              <ItensSkeleton />
            </section>
          </div>
        ) : erroTotal ? (
          <ErrorFallback onRetry={() => carregarTudo()} />
        ) : (
          <div className="grid">
            {/* -------------------- CATEGORIAS -------------------- */}
            <section className="card">
              <h2>Categorias</h2>

              <form
                className="inline-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  criarCategoria();
                }}
              >
                <input
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Nome da categoria"
                />
                <button type="submit" disabled={criandoCategoria}>
                  {criandoCategoria ? "Enviando..." : "Adicionar"}
                </button>
              </form>

              {categorias.length === 0 ? (
                <p className="muted">Nenhuma categoria cadastrada.</p>
              ) : (
                <ul className="lista">
                  {categorias.map((c) => (
                    <li key={c.id}>
                      <span>{c.name}</span>
                      <button
                        className="danger"
                        disabled={excluindoId === `categories-${c.id}`}
                        onClick={() => excluir("categories", c.id)}
                      >
                        {excluindoId === `categories-${c.id}` ? "..." : "Excluir"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* -------------------- ITENS -------------------- */}
            <section className="card">
              <h2>Itens do cardapio</h2>

              <form
                className="stack-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  criarItem();
                }}
              >
                <input
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                  placeholder="Nome do item"
                  required
                />
                <input
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                  placeholder="Descricao"
                />
                <input
                  type="number"
                  step="0.01"
                  value={item.value}
                  onChange={(e) => setItem({ ...item, value: e.target.value })}
                  placeholder="Preco (ex: 29.90)"
                />
                <select
                  value={item.category_id}
                  onChange={(e) => setItem({ ...item, category_id: e.target.value })}
                >
                  <option value="">Sem categoria</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button type="submit" disabled={criandoItem}>
                  {criandoItem ? "Enviando..." : "Adicionar item"}
                </button>
              </form>

              {itens.length === 0 ? (
                <p className="muted">Nenhum item cadastrado.</p>
              ) : (
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Categoria</th>
                      <th>Preco</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((it) => (
                      <tr key={it.id}>
                        <td>
                          <strong>{it.name}</strong>
                          {it.description && (
                            <div className="muted small">{it.description}</div>
                          )}
                        </td>
                        <td>{nomeCategoria(it.category_id)}</td>
                        <td>
                          {typeof it.value === "number"
                            ? `R$ ${it.value.toFixed(2)}`
                            : `R$ ${it.value}`}
                        </td>
                        <td>
                          <button
                            className="danger"
                            disabled={excluindoId === `items-${it.id}`}
                            onClick={() => excluir("items", it.id)}
                          >
                            {excluindoId === `items-${it.id}` ? "..." : "Excluir"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
