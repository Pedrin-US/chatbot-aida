from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Conversa, Mensagem, Chatbot, Usuario
from app.services.ai_service import get_ai_response

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


def get_default_chatbot():
    bot = Chatbot.query.filter_by(status=True).first()

    if not bot:
        bot = Chatbot(
            nome_bot="AIDA",
            versao_modelo="gemini-2.5-flash",
            descricao="Assistente Inteligente Digital Acadêmica",
            status=True,
        )
        db.session.add(bot)
        db.session.commit()

    return bot


@chat_bp.route("/conversations", methods=["GET"])
@jwt_required()
def list_conversations():
    user_id = int(get_jwt_identity())

    conversas = Conversa.query.filter_by(id_usuario=user_id).order_by(
        Conversa.data_inicio.desc()
    ).all()

    return {
        "conversations": [conversa.to_dict() for conversa in conversas]
    }, 200


@chat_bp.route("/conversations", methods=["POST"])
@jwt_required()
def create_conversation():
    user_id = int(get_jwt_identity())
    bot = get_default_chatbot()

    conversa = Conversa(
        id_usuario=user_id,
        id_chatbot=bot.id_chatbot,
        titulo="Nova conversa",
        status_conversa="ativa",
    )

    db.session.add(conversa)
    db.session.commit()

    return {
        "conversation": conversa.to_dict()
    }, 201


@chat_bp.route("/conversations/<int:conversation_id>", methods=["GET"])
@jwt_required()
def get_conversation(conversation_id):
    user_id = int(get_jwt_identity())

    conversa = Conversa.query.filter_by(
        id_conversa=conversation_id,
        id_usuario=user_id,
    ).first()

    if not conversa:
        return {"error": "Conversa não encontrada"}, 404

    mensagens = Mensagem.query.filter_by(id_conversa=conversation_id).order_by(
        Mensagem.data_hora.asc()
    ).all()

    return {
        "conversation": conversa.to_dict(),
        "messages": [msg.to_dict() for msg in mensagens],
    }, 200


@chat_bp.route("/conversations/<int:conversation_id>", methods=["DELETE"])
@jwt_required()
def delete_conversation(conversation_id):
    user_id = int(get_jwt_identity())

    conversa = Conversa.query.filter_by(
        id_conversa=conversation_id,
        id_usuario=user_id,
    ).first()

    if not conversa:
        return {"error": "Conversa não encontrada"}, 404

    db.session.delete(conversa)
    db.session.commit()

    return {"message": "Conversa excluída com sucesso"}, 200


@chat_bp.route("/conversations/<int:conversation_id>/messages", methods=["POST"])
@jwt_required()
def send_message(conversation_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    content = data.get("content", "").strip()

    if not content:
        return {"error": "Mensagem vazia"}, 400

    usuario = Usuario.query.get(user_id)

    conversa = Conversa.query.filter_by(
        id_conversa=conversation_id,
        id_usuario=user_id,
    ).first()

    if not conversa:
        return {"error": "Conversa não encontrada"}, 404

    user_msg = Mensagem(
        id_conversa=conversation_id,
        remetente="usuario",
        mensagem=content,
    )

    db.session.add(user_msg)
    db.session.commit()

    historico = Mensagem.query.filter_by(id_conversa=conversation_id).order_by(
        Mensagem.data_hora.asc()
    ).all()

    history = [
        {
            "role": "user" if msg.remetente == "usuario" else "assistant",
            "content": msg.mensagem,
        }
        for msg in historico
    ]

    resposta, _ = get_ai_response(content, history, usuario)

    bot_msg = Mensagem(
        id_conversa=conversation_id,
        remetente="chatbot",
        mensagem=resposta,
    )

    db.session.add(bot_msg)

    if conversa.titulo == "Nova conversa":
        conversa.titulo = content[:60]

    db.session.commit()

    return {
        "user_message": user_msg.to_dict(),
        "assistant_message": bot_msg.to_dict(),
    }, 201