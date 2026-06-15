from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    load_dotenv()

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost:3306/chatbot_aida",
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret"
    )

    app.config["AI_API_KEY"] = os.getenv(
        "AI_API_KEY",
        ""
    )

    app.config["AI_MODEL"] = os.getenv(
        "AI_MODEL",
        "gemini-2.5-flash"
    )

    db.init_app(app)
    jwt.init_app(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": os.getenv(
                    "FRONTEND_URL",
                    "http://localhost:5173"
                )
            }
        },
        supports_credentials=True,
    )

    from app.routes.auth import auth_bp
    from app.routes.chat import chat_bp
    from app.routes.admin import admin_bp
    from app.routes.student import student_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(student_bp)

    print("AI KEY:", app.config["AI_API_KEY"][:10])
    print("MODEL:", app.config["AI_MODEL"])

    return app