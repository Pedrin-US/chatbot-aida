import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

type Conversation = {
  id: number;
  title: string;
  created_at?: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

const API_URL = "http://localhost:5000/api";

export function ChatPage() {
  const { token, user, logout } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState("");

  async function apiFetch(path: string, options: RequestInit = {}) {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  }

  async function loadConversations() {
    if (!token) return;

    setLoadingPage(true);
    setError("");

    try {
      const res = await apiFetch("/chat/conversations");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.msg || "Erro ao carregar conversas");
        return;
      }

      setConversations(data.conversations || []);

      if ((data.conversations || []).length > 0) {
        await openConversation(data.conversations[0]);
      } else {
        await createConversation();
      }
    } catch {
      setError("Erro de conexão com o backend");
    } finally {
      setLoadingPage(false);
    }
  }

  async function createConversation() {
    if (!token) return;

    const res = await apiFetch("/chat/conversations", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao criar conversa");
      return;
    }

    const conversation = data.conversation;

    setSelectedConversation(conversation);
    setMessages([]);
    setConversations((prev) => [conversation, ...prev]);
  }

  async function openConversation(conversation: Conversation) {
    if (!token) return;

    setSelectedConversation(conversation);
    setError("");

    const res = await apiFetch(`/chat/conversations/${conversation.id}`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao abrir conversa");
      return;
    }

    setMessages(data.messages || []);
  }

  async function sendMessage() {
    if (!selectedConversation || !input.trim() || loading) return;

    const content = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    const temporaryUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, temporaryUserMessage]);

    try {
      const res = await apiFetch(
        `/chat/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.msg || "Erro ao enviar mensagem");
        return;
      }

      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== temporaryUserMessage.id),
        data.user_message,
        data.assistant_message,
      ]);

      await loadConversations();
    } catch {
      setError("Erro de conexão com o backend");
    } finally {
      setLoading(false);
    }
  }

  async function deleteConversation(id: number) {
    const res = await apiFetch(`/chat/conversations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessages([]);
      setSelectedConversation(null);
      await loadConversations();
    }
  }

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  if (loadingPage) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "#f5f5f5" }}>
      <Paper
        sx={{
          width: 300,
          borderRadius: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          AIDA
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {user?.name} | {user?.role}
        </Typography>

        <Button variant="contained" onClick={createConversation}>
          Nova conversa
        </Button>

        <Divider sx={{ my: 2 }} />

        <List sx={{ flex: 1, overflowY: "auto" }}>
          {conversations.map((conversation) => (
            <ListItemButton
              key={conversation.id}
              selected={selectedConversation?.id === conversation.id}
              onClick={() => openConversation(conversation)}
            >
              <Box sx={{ width: "100%" }}>
                <Typography noWrap fontWeight="bold">
                  {conversation.title || "Nova conversa"}
                </Typography>

                <Button
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation.id);
                  }}
                >
                  Apagar
                </Button>
              </Box>
            </ListItemButton>
          ))}
        </List>

        <Button color="error" onClick={logout}>
          Sair
        </Button>
      </Paper>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 3, bgcolor: "white", borderBottom: "1px solid #ddd" }}>
          <Typography variant="h5" fontWeight="bold">
            Chatbot Acadêmico
          </Typography>

          <Typography color="text.secondary">
            Converse com a AIDA usando seu perfil de acesso.
          </Typography>
        </Box>

        {error && (
          <Box sx={{ p: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
          {messages.length === 0 && (
            <Typography color="text.secondary">
              Envie uma mensagem para começar.
            </Typography>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: message.role === "user" ? "#1976d2" : "white",
                  color: message.role === "user" ? "white" : "black",
                }}
              >
                <Box
                  sx={{
                    whiteSpace: "normal",

                    "& p": {
                      mt: 0,
                      mb: 1,
                    },

                    "& p:last-child": {
                      mb: 0,
                    },

                    "& ul, & ol": {
                      pl: 3,
                      mt: 1,
                      mb: 1,
                    },

                    "& li": {
                      mb: 0.5,
                    },

                    "& strong": {
                      fontWeight: 700,
                    },

                    "& h1": {
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      mt: 1,
                      mb: 1,
                    },

                    "& h2": {
                      fontSize: "1.35rem",
                      fontWeight: 700,
                      mt: 1,
                      mb: 1,
                    },

                    "& h3": {
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      mt: 1,
                      mb: 1,
                    },

                    "& code": {
                      backgroundColor:
                        message.role === "user"
                          ? "rgba(255,255,255,0.2)"
                          : "#f4f4f4",
                      px: "4px",
                      py: "2px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    },

                    "& pre": {
                      backgroundColor:
                        message.role === "user"
                          ? "rgba(255,255,255,0.15)"
                          : "#f4f4f4",
                      p: 2,
                      borderRadius: "8px",
                      overflowX: "auto",
                    },

                    "& table": {
                      borderCollapse: "collapse",
                      width: "100%",
                      mt: 1,
                      mb: 1,
                    },

                    "& th, & td": {
                      border: "1px solid #ddd",
                      p: 1,
                    },

                    "& th": {
                      backgroundColor:
                        message.role === "user"
                          ? "rgba(255,255,255,0.15)"
                          : "#f5f5f5",
                      fontWeight: 700,
                    },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </Box>
              </Paper>
            </Box>
          ))}

          {loading && <CircularProgress size={24} />}
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            display: "flex",
            gap: 2,
            borderTop: "1px solid #ddd",
          }}
        >
          <TextField
            fullWidth
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <Button variant="contained" onClick={sendMessage} disabled={loading}>
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}