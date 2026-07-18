import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // FASE 2 (protegida): mensagens claras por tipo de falha. O <ConnectionBanner>
      // ja avisa lentidao/offline; aqui damos o feedback especifico do login.
      let msg;
      if (err.response?.status === 401) {
        msg = "Email ou senha invalidos.";
      } else if (err.code === "ECONNABORTED") {
        msg = "O servidor demorou a responder. Tente novamente.";
      } else if (!err.response) {
        msg = "Sem conexao com o servidor. Tente novamente em instantes.";
      } else {
        msg = "Falha ao autenticar. Tente novamente.";
      }
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Cardapio Admin</h1>
        <p className="muted">Entre para gerenciar o cardapio</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@exemplo.com"
          required
        />

        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="sua senha"
          required
        />

        {erro && <div className="erro">{erro}</div>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="muted small" style={{ marginTop: 8 }}>
          Contas de admin sao criadas pelo backend (seed/console).
        </p>
      </form>
    </div>
  );
}
