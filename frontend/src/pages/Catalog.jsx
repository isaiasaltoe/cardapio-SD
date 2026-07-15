import { useEffect, useState } from "react";
import api from "../api/client";
import { getWithCache } from "../lib/cache";
import { ItensSkeleton } from "../components/Skeleton";
import ErrorFallback from "../components/ErrorFallback";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Catalog() {
  const { admin } = useAuth();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroTotal, setErroTotal] = useState(false);

  async function carregarTudo() {
    setCarregando(true);
    setErroTotal(false);
    try {
      const it = await getWithCache(api, "/api/v1/items");
      setItens(it.data);
    } catch {
      setErroTotal(true);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Cardápio</strong>
        </div>
        {admin && (
          <div className="topbar-actions">
            <Link to="/admin">
              <button>Painel Admin</button>
            </Link>
          </div>
        )}
      </header>

      <main className="container">
        {carregando ? (
          <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
            <section className="card">
              <ItensSkeleton />
            </section>
          </div>
        ) : erroTotal ? (
          <ErrorFallback onRetry={() => carregarTudo()} />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {itens.length === 0 ? (
              <p className="muted">Nenhum item disponível.</p>
            ) : (
              itens.map((it) => (
                <div key={it.id} className="card public-item-card">
                  {it.photo_url ? (
                    <img src={it.photo_url} alt={it.name} className="public-item-photo" />
                  ) : (
                    <div className="public-item-photo-placeholder" />
                  )}
                  <div className="public-item-info">
                    <h3>{it.name}</h3>
                    {it.description && <p className="muted small">{it.description}</p>}
                    <strong className="public-item-price">R$ {parseFloat(it.value).toFixed(2)}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
