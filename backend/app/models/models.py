from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class Usuario(db.Model):
    __tablename__ = "usuario"

    id_usuario = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    senha = db.Column(db.String(255), nullable=False)
    tipo_usuario = db.Column(
        db.Enum("admin", "aluno", "professor", "responsavel"),
        nullable=False,
        default="aluno",
    )
    telefone = db.Column(db.String(20), nullable=True)
    ultimo_acesso = db.Column(db.DateTime, nullable=True)
    data_cadastro = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    status = db.Column(db.Boolean, default=True)

    aluno = db.relationship("Aluno", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    professor = db.relationship("Professor", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    responsavel = db.relationship("Responsavel", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
    conversas = db.relationship("Conversa", back_populates="usuario", cascade="all, delete-orphan", passive_deletes=True)

    def set_password(self, password):
        self.senha = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.senha, password)

    def ativo_30_dias(self):
        if not self.ultimo_acesso:
            return False
        ultimo = self.ultimo_acesso
        if ultimo.tzinfo is None:
            ultimo = ultimo.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) - ultimo <= timedelta(days=30)

    def to_dict(self):
        return {
            "id": self.id_usuario,
            "name": self.nome,
            "email": self.email,
            "role": self.tipo_usuario,
            "telefone": self.telefone,
            "status": self.status,
            "last_seen": self.ultimo_acesso.isoformat() if self.ultimo_acesso else None,
            "online_30_days": self.ativo_30_dias(),
        }


class Aluno(db.Model):
    __tablename__ = "aluno"

    id_aluno = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    matricula = db.Column(db.String(30), unique=True, nullable=False)
    turma = db.Column(db.String(50))
    serie = db.Column(db.String(50))

    usuario = db.relationship("Usuario", back_populates="aluno")


class Professor(db.Model):
    __tablename__ = "professor"

    id_professor = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    disciplina = db.Column(db.String(100))
    registro_profissional = db.Column(db.String(50))

    usuario = db.relationship("Usuario", back_populates="professor")


class Responsavel(db.Model):
    __tablename__ = "responsavel"

    id_responsavel = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    parentesco = db.Column(db.String(50))

    usuario = db.relationship("Usuario", back_populates="responsavel")


class ResponsavelAluno(db.Model):
    __tablename__ = "responsavel_aluno"

    id_responsavel_aluno = db.Column(db.Integer, primary_key=True)
    id_responsavel = db.Column(db.Integer, db.ForeignKey("responsavel.id_responsavel", ondelete="CASCADE"), nullable=False)
    id_aluno = db.Column(db.Integer, db.ForeignKey("aluno.id_aluno", ondelete="CASCADE"), nullable=False)


class Chatbot(db.Model):
    __tablename__ = "chatbot"

    id_chatbot = db.Column(db.Integer, primary_key=True)
    nome_bot = db.Column(db.String(100), nullable=False)
    versao_modelo = db.Column(db.String(100))
    descricao = db.Column(db.Text)
    status = db.Column(db.Boolean, default=True)


class Conversa(db.Model):
    __tablename__ = "conversa"

    id_conversa = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_chatbot = db.Column(db.Integer, db.ForeignKey("chatbot.id_chatbot", ondelete="CASCADE"), nullable=False)
    titulo = db.Column(db.String(200), default="Nova conversa")
    data_inicio = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    data_fim = db.Column(db.DateTime)
    status_conversa = db.Column(db.String(50), default="ativa")

    usuario = db.relationship("Usuario", back_populates="conversas")
    mensagens = db.relationship("Mensagem", back_populates="conversa", cascade="all, delete-orphan", passive_deletes=True)

    def to_dict(self):
        return {
            "id": self.id_conversa,
            "title": self.titulo,
            "created_at": self.data_inicio.isoformat() if self.data_inicio else None,
            "status": self.status_conversa,
        }


class Mensagem(db.Model):
    __tablename__ = "mensagem"

    id_mensagem = db.Column(db.Integer, primary_key=True)
    id_conversa = db.Column(db.Integer, db.ForeignKey("conversa.id_conversa", ondelete="CASCADE"), nullable=False)
    remetente = db.Column(db.Enum("usuario", "chatbot"), nullable=False)
    mensagem = db.Column(db.Text, nullable=False)
    data_hora = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    intencao_detectada = db.Column(db.String(100))
    sentimento = db.Column(db.String(50))

    conversa = db.relationship("Conversa", back_populates="mensagens")

    def to_dict(self):
        role = "user" if self.remetente == "usuario" else "assistant"
        return {
            "id": self.id_mensagem,
            "role": role,
            "content": self.mensagem,
            "created_at": self.data_hora.isoformat() if self.data_hora else None,
        }


class PerguntaFrequente(db.Model):
    __tablename__ = "pergunta_frequente"

    id_pergunta = db.Column(db.Integer, primary_key=True)
    pergunta = db.Column(db.Text, nullable=False)
    resposta = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(100))
    nivel_confianca = db.Column(db.Float)
    data_cadastro = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


class Feedback(db.Model):
    __tablename__ = "feedback"

    id_feedback = db.Column(db.Integer, primary_key=True)
    id_conversa = db.Column(db.Integer, db.ForeignKey("conversa.id_conversa", ondelete="CASCADE"), nullable=False)
    nota = db.Column(db.Integer)
    comentario = db.Column(db.Text)
    data_feedback = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


class LogAcesso(db.Model):
    __tablename__ = "log_acesso"

    id_log = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    acao = db.Column(db.String(100))
    ip_acesso = db.Column(db.String(100))
    data_hora = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
class Aviso(db.Model):
    __tablename__ = "aviso"

    id_aviso = db.Column(
        db.Integer,
        primary_key=True
    )

    id_professor = db.Column(
        db.Integer,
        db.ForeignKey(
            "professor.id_professor",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    turma = db.Column(
        db.String(50),
        nullable=False
    )

    serie = db.Column(
        db.String(50)
    )

    titulo = db.Column(
        db.String(150),
        nullable=False
    )

    mensagem = db.Column(
        db.Text,
        nullable=False
    )

    data_publicacao = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    status = db.Column(
        db.Boolean,
        default=True
    )

    professor = db.relationship(
        "Professor"
    )

    def to_dict(self):
        return {
            "id": self.id_aviso,
            "titulo": self.titulo,
            "mensagem": self.mensagem,
            "turma": self.turma,
            "serie": self.serie,
            "professor":
                self.professor.usuario.nome
                if self.professor and self.professor.usuario
                else None,
            "data_publicacao":
                self.data_publicacao.isoformat()
                if self.data_publicacao
                else None,
        }