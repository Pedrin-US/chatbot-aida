/**
 * api.ts — camada de acesso ao backend Flask.
 * Todas as chamadas HTTP passam por aqui.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("aida_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type UserRole = "aluno" | "professor" | "usuario";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  attachment?: Attachment;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: UserRole) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  me: () => request<User>("/auth/me"),
};

// ── Chat ─────────────────────────────────────────────────────────────────────

export const chatApi = {
  listConversations: () => request<Conversation[]>("/chat/conversations"),

  createConversation: (title?: string) =>
    request<Conversation>("/chat/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (id: number) =>
    request<void>(`/chat/conversations/${id}`, { method: "DELETE" }),

  listMessages: (convId: number) =>
    request<Message[]>(`/chat/conversations/${convId}/messages`),

  sendMessage: (convId: number, content: string) =>
    request<{ user_message: Message; bot_message: Message }>(
      `/chat/conversations/${convId}/messages`,
      { method: "POST", body: JSON.stringify({ content }) }
    ),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  updateProfile: (data: { name?: string; avatar?: string }) =>
    request<User>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
