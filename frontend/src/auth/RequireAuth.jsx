import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Protege rotas: sem token, manda pro login.
export default function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
