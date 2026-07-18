// FASE 2 (protegida) - Skeleton screens.
// Enquanto os dados carregam, exibimos "esqueletos" animados que imitam o
// layout real (em vez de uma tela em branco ou um "Carregando...").

function Bar({ w = "100%", h = 14 }) {
  return <span className="skeleton" style={{ width: w, height: h }} />;
}

export function CategoriasSkeleton() {
  return (
    <ul className="lista">
      {[70, 55, 80].map((w, i) => (
        <li key={i}>
          <Bar w={`${w}%`} />
          <Bar w="60px" h={28} />
        </li>
      ))}
    </ul>
  );
}

export function ItensSkeleton() {
  return (
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
        {[0, 1, 2, 3].map((i) => (
          <tr key={i}>
            <td>
              <Bar w="70%" />
            </td>
            <td>
              <Bar w="50%" />
            </td>
            <td>
              <Bar w="40%" />
            </td>
            <td>
              <Bar w="60px" h={28} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Usado como fallback do lazy loading (React.lazy/Suspense) do Dashboard.
export function DashboardSkeleton() {
  return (
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
  );
}
