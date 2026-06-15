from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Usuario, Aluno, Professor, Responsavel
from app.services.permissions import require_admin_response

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    denied = require_admin_response()
    if denied:
        return denied

    usuarios = Usuario.query.order_by(Usuario.data_cadastro.desc()).all()

    return {
        "users": [usuario.to_dict() for usuario in usuarios]
    }, 200


@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@jwt_required()
def update_role(user_id):
    denied = require_admin_response()
    if denied:
        return denied

    current_user_id = int(get_jwt_identity())

    if user_id == current_user_id:
        return {"error": "Você não pode alterar seu próprio cargo"}, 400

    data = request.get_json() or {}
    new_role = data.get("role")

    allowed = ["admin", "aluno", "professor", "responsavel"]

    if new_role not in allowed:
        return {"error": "Cargo inválido"}, 400

    usuario = Usuario.query.get(user_id)

    if not usuario:
        return {"error": "Usuário não encontrado"}, 404

    usuario.tipo_usuario = new_role

    Aluno.query.filter_by(id_usuario=user_id).delete()
    Professor.query.filter_by(id_usuario=user_id).delete()
    Responsavel.query.filter_by(id_usuario=user_id).delete()

    if new_role == "aluno":
        aluno = Aluno(
            id_usuario=user_id,
            matricula=data.get("matricula") or f"MAT{user_id:05d}",
            turma=data.get("turma"),
            serie=data.get("serie"),
        )
        db.session.add(aluno)

    elif new_role == "professor":
        professor = Professor(
            id_usuario=user_id,
            disciplina=data.get("disciplina"),
            registro_profissional=data.get("registro_profissional"),
        )
        db.session.add(professor)

    elif new_role == "responsavel":
        responsavel = Responsavel(
            id_usuario=user_id,
            parentesco=data.get("parentesco", "Responsável"),
        )
        db.session.add(responsavel)

    db.session.commit()

    return {
        "message": "Cargo atualizado com sucesso",
        "user": usuario.to_dict(),
    }, 200


@admin_bp.route("/users/<int:user_id>/status", methods=["PUT"])
@jwt_required()
def update_status(user_id):
    denied = require_admin_response()
    if denied:
        return denied

    data = request.get_json() or {}
    status = bool(data.get("status", True))

    usuario = Usuario.query.get(user_id)

    if not usuario:
        return {"error": "Usuário não encontrado"}, 404

    usuario.status = status
    db.session.commit()

    return {"message": "Status atualizado com sucesso", "user": usuario.to_dict()}, 200