import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router";

export function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                console.log(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao conectar ao servidor.");
        }
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(120deg,#003C9E 0%,#005DE8 45%,#EAF3FF 100%)",
            }}
        >
            <Paper
                sx={{
                    p: 5,
                    width: "100%",
                    maxWidth: 450,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    mb={1}
                >
                    Recuperar Senha
                </Typography>

                <Typography
                    color="text.secondary"
                    textAlign="center"
                    mb={4}
                >
                    Digite seu e-mail para receber instruções.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Se o e-mail existir, enviaremos as instruções.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="E-mail"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Enviar
                    </Button>

                    <Button
                        fullWidth
                        onClick={() => navigate("/")}
                    >

                        Voltar ao Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}