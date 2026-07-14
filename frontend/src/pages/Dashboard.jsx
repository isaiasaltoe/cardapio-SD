import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { admin, logout } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Form de nova categoria
  const [novaCategoria, setNovaCategoria] = useState("");

  // Form de novo item
  const [item, setItem] = useState({
    name: "",
    description: "",
    value: "",
    category_id: "",
  });

  // ---------------------------------------------------------------------------
  // FASE 1 (vulneravel): carregamento cru.
  //  - Sem skeleton screen (so um "Carregando...").
  //  - Sem cache local de fallback: se a API cair, some tudo da tela.
  //  - Sem retry: qualquer erro de rede ja vira mensagem de erro.
  // ---------------------------------------------------------------------------
  async function carregarTudo() {
    setCarregando(true);
    setErro("");
    try {
      const [catRes, itemRes] = await Promise.all([
        api.get("/api/v1/categories"),
        api.get("/api/v1/items"),
      ]);
      setCategorias(catRes.data);
      setItens(itemRes.data);
    } catch (err) {
      setErro("Nao foi possivel carregar os dados. O servidor respondeu com erro ou esta fora do ar.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  async function criarCategoria(e) {
    e.preventDefault();
    if (!novaCategoria.trim()) return;
    try {
      await api.post("/api/v1/categories", {
        category: { name: novaCategoria.trim() },
      });
      setNovaCategoria("");
      carregarTudo();
    } catch {
      setErro("Falha ao criar categoria.");
    }
  }

  async function excluirCategoria(id) {
    try {
      await api.delete(`/api/v1/categories/${id}`);
      carregarTudo();
    } catch {
      setErro("Falha ao excluir categoria.");
    }
  }

  async function criarItem(e) {
    e.preventDefault();
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
      carregarTudo();
    } catch {
      setErro("Falha ao criar item. Confira os campos.");
    }
  }

  async function excluirItem(id) {
    try {
      await api.delete(`/api/v1/items/${id}`);
      carregarTudo();
    } catch {
      setErro("Falha ao excluir item.");
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
          <button className="ghost" onClick={carregarTudo}>
            Recarregar
          </button>
          <button className="ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="container">
        {erro && <div className="erro banner">{erro}</div>}

        {carregando ? (
          <p className="muted">Carregando...</p>
        ) : (
          <div className="grid">
            {/* -------------------- CATEGORIAS -------------------- */}
            <section className="card">
              <h2>Categorias</h2>

              <form className="inline-form" onSubmit={criarCategoria}>
                <input
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Nome da categoria"
                />
                {/* FASE 1: sem debounce; clicar varias vezes dispara varias requisicoes. */}
                <button type="submit">Adicionar</button>
              </form>

              {categorias.length === 0 ? (
                <p className="muted">Nenhuma categoria cadastrada.</p>
              ) : (
                <ul className="lista">
                  {categorias.map((c) => (
                    <li key={c.id}>
                      <span>{c.name}</span>
                      <button className="danger" onClick={() => excluirCategoria(c.id)}>
                        Excluir
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* -------------------- ITENS -------------------- */}
            <section className="card">
              <h2>Itens do cardapio</h2>

              <form className="stack-form" onSubmit={criarItem}>
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
                <button type="submit">Adicionar item</button>
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
                          <button className="danger" onClick={() => excluirItem(it.id)}>
                            Excluir
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
