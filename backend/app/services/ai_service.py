from google import genai
from flask import current_app
from typing import Optional


SYSTEM_PROMPT = """Você é a AIDA, Assistente Inteligente Digital Acadêmica.

Você ajuda alunos, professores, responsáveis e administradores de uma escola.

Regras:
- Responda sempre em português do Brasil.
- Seja claro, educado e objetivo.
- Não invente notas, faltas, dados pessoais ou informações oficiais da escola.
- Quando não souber algo específico da escola, oriente o usuário a procurar a secretaria.
"""


def get_ai_response(
    user_message: str,
    history: list[dict],
    user=None,
) -> tuple[str, Optional[dict]]:

    api_key = current_app.config.get("AI_API_KEY", "")
    model = current_app.config.get("AI_MODEL", "gemini-2.5-flash")

    if not api_key:
        return _fallback_response(user_message, user), None

    try:
        client = genai.Client(api_key=api_key)

        role_prompt = ""

        if user:
            if user.tipo_usuario == "admin":
                role_prompt = "O usuário é administrador. Pode receber orientações sobre gestão do sistema."
            elif user.tipo_usuario == "professor":
                role_prompt = "O usuário é professor. Responda com foco pedagógico e planejamento escolar."
            elif user.tipo_usuario == "aluno":
                role_prompt = "O usuário é aluno. Explique de forma simples, didática e encorajadora."
            elif user.tipo_usuario == "responsavel":
                role_prompt = "O usuário é responsável. Responda com foco em acompanhamento escolar."

        history_text = ""

        for msg in history:
            role = "Usuário" if msg.get("role") == "user" else "AIDA"
            history_text += f"{role}: {msg.get('content', '')}\n"

        prompt = f"""{SYSTEM_PROMPT}

{role_prompt}

Histórico:
{history_text}

Mensagem atual:
{user_message}
"""

        response = client.models.generate_content(
            model=model,
            contents=prompt,
        )

        return response.text or "Não consegui gerar uma resposta agora.", None

    except Exception as e:
        current_app.logger.error(f"Erro ao chamar Gemini: {e}")
        return "Desculpe, ocorreu um erro ao consultar a IA. Tente novamente.", None


def _fallback_response(message: str, user=None) -> str:
    nome = user.nome if user else "usuário"

    return (
        f"Olá, {nome}! Sou a AIDA 👋\n\n"
        "Estou sem chave de IA configurada no momento.\n"
        f"Você disse: {message}"
    )