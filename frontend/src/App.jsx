import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/Login";
import RequireAuth from "./auth/RequireAuth";
import { DashboardSkeleton } from "./components/Skeleton";
import Catalog from "./pages/Catalog";

// FASE 2 (protegida) - Lazy loading: o Dashboard (componente mais pesado) so e
// baixado quando necessario, via import dinamico. Reduz o bundle inicial.
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Catalog />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Suspense
              fallback={
                <div className="container">
                  <DashboardSkeleton />
                </div>
              }
            >
              <Dashboard />
            </Suspense>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
