from app import create_app, db
from app.models import Usuario

app = create_app()

with app.app_context():
    email = "admin@aida.com"
    senha = "123456"

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario:
        usuario.tipo_usuario = "admin"
        usuario.set_password(senha)
        print("Admin atualizado.")
    else:
        usuario = Usuario(
            nome="Administrador",
            email=email,
            tipo_usuario="admin",
            status=True,
        )
        usuario.set_password(senha)
        db.session.add(usuario)
        print("Admin criado.")

    db.session.commit()

    print("E-mail:", email)
    print("Senha:", senha)