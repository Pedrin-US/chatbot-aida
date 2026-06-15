from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import Usuario, Aluno, Aviso

student_bp = Blueprint(
    "student",
    __name__,
    url_prefix="/api/student"
)


@student_bp.route("/avisos", methods=["GET"])
@jwt_required()
def list_avisos():
    user_id = int(get_jwt_identity())

    usuario = Usuario.query.get(user_id)

    if not usuario:
        return {"error": "Usuário não encontrado"}, 404

    if usuario.tipo_usuario != "aluno":
        return {"error": "Apenas alunos podem acessar"} ,403

    aluno = Aluno.query.filter_by(
        id_usuario=user_id
    ).first()

    if not aluno:
        return {"error": "Aluno não encontrado"}, 404

    avisos = Aviso.query.filter_by(
        turma=aluno.turma,
        status=True
    ).order_by(
        Aviso.data_publicacao.desc()
    ).all()

    return {
        "aluno": {
            "nome": usuario.nome,
            "matricula": aluno.matricula,
            "turma": aluno.turma,
            "serie": aluno.serie
        },
        "avisos": [
            aviso.to_dict()
            for aviso in avisos
        ]
    }, 200