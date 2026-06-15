import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Painel AIDA
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Bem-vindo, {user?.name}. Seu perfil é: {user?.role}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Chat IA</Typography>
              <Typography mb={2}>Converse com a AIDA.</Typography>
              <Button variant="contained" onClick={() => navigate("/chat")}>
                Abrir Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {user?.role === "admin" && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Painel Admin</Typography>
                <Typography mb={2}>Gerencie usuários e professores.</Typography>
                <Button variant="contained" onClick={() => navigate("/admin")}>
                  Abrir Admin
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {user?.role === "professor" && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Área do Professor</Typography>
                <Typography mb={2}>Em breve: turmas e materiais.</Typography>
                <Button variant="outlined">Acessar</Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {user?.role === "aluno" && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Área do Aluno</Typography>
                <Typography mb={2}>Em breve: atividades e materiais.</Typography>
                <Button variant="outlined">Acessar</Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}