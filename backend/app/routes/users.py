from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User
from .. import db

users_bp = Blueprint("users", __name__)


@users_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Atualiza nome e avatar do usuário autenticado."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    if "name" in data:
        user.name = data["name"].strip()
    if "avatar" in data:
        user.avatar = data["avatar"]

    db.session.commit()
    return jsonify(user.to_dict()), 200


@users_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    """Troca a senha do usuário autenticado."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    if not data.get("current_password") or not data.get("new_password"):
        return jsonify({"error": "current_password e new_password são obrigatórios"}), 400

    if not user.check_password(data["current_password"]):
        return jsonify({"error": "Senha atual incorreta"}), 401

    user.set_password(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Senha atualizada com sucesso"}), 200
