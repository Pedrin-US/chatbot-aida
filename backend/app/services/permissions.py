from flask_jwt_extended import get_jwt_identity
from app.models import Usuario


def get_current_user():
    user_id = get_jwt_identity()

    if not user_id:
        return None

    return Usuario.query.get(int(user_id))


def require_admin_response():
    user = get_current_user()

    if not user or user.tipo_usuario != "admin":
        return {"error": "Acesso negado. Apenas administradores podem acessar."}, 403

    return None