import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../../api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link } from "react-router-dom";

export function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState<UserRole>("aluno");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, regEmail, regPassword, role);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(120deg, #003C9E 0%, #005DE8 45%, #EAF3FF 100%)",
      }}
    >
      {/* LADO ESQUERDO */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: 10,
          color: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: 3,
            lineHeight: 1,
            mb: 3,
          }}
        >
          AIDA
        </Typography>

        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 500,
            maxWidth: 520,
          }}
        >
          Assistente Inteligente de Direcionamento Automatizado
        </Typography>

        <Box
          sx={{
            width: 510,
            height: 3,
            bgcolor: "#7DD3FC",
            my: 4,
            borderRadius: 10,
          }}
        />

        <Typography
          sx={{
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          Plataforma acadêmica inteligente para estudantes, professores e
          usuários. Converse com a AIDA e obtenha informações rápidas,
          organizadas e automatizadas.
        </Typography>
      </Box>

      {/* LADO DIREITO */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 3, sm: 5 },
            borderRadius: 6,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 90,
                height: 90,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                bgcolor: "#EAF3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlineIcon
                sx={{
                  fontSize: 50,
                  color: "#0052CC",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              color="#071E55"
            >
              {mode === "login"
                ? "Bem-vindo(a) à AIDA"
                : "Criar conta"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {mode === "login"
                ? "Faça login para continuar"
                : "Cadastre-se para acessar a plataforma"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {mode === "login" ? (
            <Box component="form" onSubmit={handleLogin}>
              <Typography fontWeight={700} mb={1}>
                E-mail
              </Typography>

              <TextField
                fullWidth
                required
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Typography fontWeight={700} mb={1}>
                Senha
              </Typography>

              <TextField
                fullWidth
                required
                type="password"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography
                component={Link}
                to="/forgot-password"
                sx={{
                  display: "block",
                  textAlign: "right",
                  color: "#0052CC",
                  fontWeight: 700,
                  mb: 3,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Esqueceu sua senha?
              </Typography>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  fontSize: 18,
                  fontWeight: 700,
                  bgcolor: "#0052CC",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Entrar"
                )}
              </Button>

              <Divider sx={{ my: 4 }}>ou</Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonAddAltIcon />}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: 17,
                  fontWeight: 700,
                }}
              >
                Criar nova conta
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                label="Nome completo"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="E-mail"
                type="email"
                fullWidth
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                select
                fullWidth
                label="Perfil"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as UserRole)
                }
                sx={{ mb: 3 }}
              >
                <MenuItem value="aluno">Aluno</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
                <MenuItem value="usuario">Usuário</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.6,
                  borderRadius: 2,
                  fontSize: 18,
                  fontWeight: 700,
                  bgcolor: "#0052CC",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Cadastrar"
                )}
              </Button>

              <Button
                fullWidth
                sx={{
                  mt: 2,
                  fontWeight: 700,

                  py: 1.5,
                  borderRadius: 2,
                  fontSize: 17,
                }}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Já tenho conta
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}