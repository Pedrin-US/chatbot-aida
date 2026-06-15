-- ============================================================
-- ChatBotAIDA – Script de criação do banco de dados MySQL
-- Execute: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS chatbot_aida
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chatbot_aida;

-- ── Usuários ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120)                        NOT NULL,
  email        VARCHAR(120)                        NOT NULL UNIQUE,
  password_hash VARCHAR(256)                       NOT NULL,
  role         ENUM('aluno','professor','usuario') NOT NULL DEFAULT 'aluno',
  avatar       VARCHAR(255)                        NULL,
  is_active    TINYINT(1)                          NOT NULL DEFAULT 1,
  created_at   DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Conversas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT                                  NOT NULL,
  title      VARCHAR(200)                         NOT NULL DEFAULT 'Nova conversa',
  created_at DATETIME                             NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME                             NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Mensagens ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT                              NOT NULL,
  role            ENUM('user','assistant')         NOT NULL,
  content         TEXT                             NOT NULL,
  attachment_name VARCHAR(255)                     NULL,
  attachment_url  VARCHAR(500)                     NULL,
  created_at      DATETIME                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Usuário de teste (senha: admin123) ───────────────────────
-- Remova ou altere em produção!
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES (
  'Administrador',
  'admin@escola.edu.br',
  'pbkdf2:sha256:600000$salt$hash',   -- substitua pelo hash real via Python
  'usuario'
);
