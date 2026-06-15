import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export function AdminPanel() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Painel Administrativo
      </Typography>

      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Typography variant="h6">Gerenciar usuários</Typography>
          <Typography mb={2}>
            Cadastre professores, visualize usuários e altere permissões.
          </Typography>

          <Button variant="contained" onClick={() => navigate("/admin/users")}>
            Abrir usuários
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}