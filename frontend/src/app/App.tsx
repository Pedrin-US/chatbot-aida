import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { ChatPage } from "./pages/ChatPage";
import { Dashboard } from "./pages/Dashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { UsersPage } from "./pages/UsersPage";
import { StudentHome } from "./pages/StudentHome";
import ProtectedRoute from "../components/ProtectedRoute";
import { ForgotPassword } from "./pages/ForgotPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Login />} />

          <Route
            path="/aluno"
            element={
              <ProtectedRoute allowedRoles={["aluno"]}>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}