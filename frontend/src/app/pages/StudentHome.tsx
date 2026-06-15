import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export function StudentHome() {
  const { token, user, logout } = useAuth();

  const navigate = useNavigate();

  const [avisos, setAvisos] = useState<any[]>([]);
  const [aluno, setAluno] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  async function loadAvisos() {
    try {
      const res = await fetch(
        `${API_URL}/student/avisos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setAluno(data.aluno);
      setAvisos(data.avisos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadAvisos();
    }
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          bgcolor: "#1e3a8a",
          color: "white",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h3">
          AIDA
        </Typography>

        <Typography>
          Assistente Inteligente de Direcionamento Automatizado
        </Typography>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#1e3a8a"
        >
          Olá, {user?.name}
        </Typography>

        <Typography mt={2}>
          Bem-vindo ao portal acadêmico.
        </Typography>

        {aluno && (
          <Typography mt={1}>
            Turma: {aluno.turma}
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            mt: 3,
          }}
          onClick={() => navigate("/chat")}
        >
          Abrir Chat
        </Button>
      </Box>

      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
        >
          Avisos da Turma
        </Typography>

        {avisos.length === 0 && (
          <Typography>
            Nenhum aviso encontrado.
          </Typography>
        )}

        {avisos.map((aviso) => (
          <Card
            key={aviso.id}
            sx={{
              mb: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color="primary"
              >
                {aviso.titulo}
              </Typography>

              <Typography mt={1}>
                {aviso.mensagem}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={2}
              >
                Professor: {aviso.professor}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          p: 3,
        }}
      >
        <Button
          color="error"
          onClick={logout}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}