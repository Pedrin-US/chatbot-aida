from datetime import datetime, timezone
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import Usuario, Aluno, Responsavel, LogAcesso

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    nome = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    senha = data.get("password", "")
    tipo_usuario = data.get("role", "aluno")

    if tipo_usuario not in ["aluno", "responsavel"]:
        tipo_usuario = "aluno"

    if not nome or not email or not senha:
        return {"error": "Nome, e-mail e senha são obrigatórios"}, 400

    if Usuario.query.filter_by(email=email).first():
        return {"error": "Este e-mail já está cadastrado"}, 400

    usuario = Usuario(
        nome=nome,
        email=email,
        tipo_usuario=tipo_usuario,
        ultimo_acesso=datetime.now(timezone.utc),
    )
    usuario.set_password(senha)

    db.session.add(usuario)
    db.session.flush()

    if tipo_usuario == "aluno":
        matricula = data.get("matricula") or f"MAT{usuario.id_usuario:05d}"
        aluno = Aluno(
            id_usuario=usuario.id_usuario,
            matricula=matricula,
            turma=data.get("turma"),
            serie=data.get("serie"),
        )
        db.session.add(aluno)

    if tipo_usuario == "responsavel":
        responsavel = Responsavel(
            id_usuario=usuario.id_usuario,
            parentesco=data.get("parentesco", "Responsável"),
        )
        db.session.add(responsavel)

    db.session.add(LogAcesso(
        id_usuario=usuario.id_usuario,
        acao="register",
        ip_acesso=request.remote_addr,
    ))

    db.session.commit()

    access_token = create_access_token(identity=str(usuario.id_usuario))

    return {
        "message": "Cadastro realizado com sucesso",
        "access_token": access_token,
        "token": access_token,
        "user": usuario.to_dict(),
    }, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    senha = data.get("password", "")

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_password(senha):
        return {"error": "E-mail ou senha inválidos"}, 401

    if not usuario.status:
        return {"error": "Usuário desativado"}, 403

    usuario.ultimo_acesso = datetime.now(timezone.utc)

    db.session.add(LogAcesso(
        id_usuario=usuario.id_usuario,
        acao="login",
        ip_acesso=request.remote_addr,
    ))

    db.session.commit()

    access_token = create_access_token(identity=str(usuario.id_usuario))

    return {
        "message": "Login realizado com sucesso",
        "access_token": access_token,
        "token": access_token,
        "user": usuario.to_dict(),
    }, 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    usuario = Usuario.query.get(user_id)

    if not usuario:
        return {"error": "Usuário não encontrado"}, 404

    return {"user": usuario.to_dict()}, 200