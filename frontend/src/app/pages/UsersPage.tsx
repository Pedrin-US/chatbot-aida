import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  last_seen: string | null;
  online_30_days: boolean;
};

const API_URL = "http://localhost:5000/api";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  async function loadUsers() {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setUsers(data.users);
    } else {
      setMessage(data.error || "Erro ao carregar usuários");
    }
  }

  async function updateRole(id: number, newRole: string) {
    setMessage("");

    const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: newRole,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erro ao alterar cargo");
      return;
    }

    setMessage("Cargo alterado com sucesso!");
    loadUsers();
  }

  function formatDate(date: string | null) {
    if (!date) return "Nunca acessou";

    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      const text = `${user.name} ${user.email} ${user.role}`.toLowerCase();
      return text.includes(term);
    });
  }, [search, users]);

  const activeUsers = users.filter((user) => user.online_30_days);

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Gerenciar cargos
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Usuários ativos nos últimos 30 dias: {activeUsers.length}
      </Typography>

      {message && (
        <Alert
          severity={message.includes("sucesso") ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Procurar usuário
          </Typography>

          <TextField
            fullWidth
            label="Pesquisar por nome, e-mail ou cargo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Typography variant="h6" mb={2}>
        Lista de usuários
      </Typography>

      {filteredUsers.length === 0 && (
        <Typography color="text.secondary">
          Nenhum usuário encontrado.
        </Typography>
      )}

      {filteredUsers.map((user) => (
        <Card key={user.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {user.name} | {user.email} | {user.role}
                </Typography>

                <Typography color="text.secondary">
                  Último acesso: {formatDate(user.last_seen)}
                </Typography>

                {user.online_30_days ? (
                  <Chip
                    label="Ativo nos últimos 30 dias"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Chip
                    label="Inativo há mais de 30 dias"
                    color="default"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Box sx={{ minWidth: 220 }}>
                <TextField
                  select
                  fullWidth
                  label="Alterar cargo"
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="professor">Professor</MenuItem>
                  <MenuItem value="aluno">Aluno</MenuItem>
                  <MenuItem value="usuario">Usuário</MenuItem>
                </TextField>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" sx={{ mt: 2 }} onClick={loadUsers}>
        Atualizar lista
      </Button>
    </Box>
  );
}