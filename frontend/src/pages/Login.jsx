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
      const msg =
        err.response?.status === 401
          ? "Email ou senha inválidos."
          : "Falha ao autenticar. Verifique os dados ou o servidor.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Cardápio Admin</h1>
        <p className="muted">Entre para gerenciar o cardápio</p>

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
          Contas de admin são criadas pelo backend (seed/console).
        </p>
      </form>
    </div>
  );
}
