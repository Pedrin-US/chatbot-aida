import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ── Banco de dados ──────────────────────────────────────────────────
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:senha@localhost:3306/chatbot_aida",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ── JWT ─────────────────────────────────────────────────────────────
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "troque-esta-chave-em-producao")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    # ── CORS ─────────────────────────────────────────────────────────────
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # ── Chave da IA ──────────────────────────────────────────────────────
    # Adicione sua chave da API da IA aqui (ex: Anthropic, OpenAI, etc.)
    AI_API_KEY = os.getenv("AI_API_KEY", "")
    AI_MODEL = os.getenv("AI_MODEL", "claude-sonnet-4-20250514")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
