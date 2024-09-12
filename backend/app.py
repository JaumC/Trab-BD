# backend/app.py

from flask import Flask
from flask_cors import CORS
from config import Config
import sys
import os

# Adiciona o diretório raiz ao caminho do Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


app = Flask(__name__)
app.config.from_object(Config)
CORS(app)


from endpoints.user import user_blueprint
from endpoints.pet import pet_blueprint
from endpoints.favoritos import favoritos_blueprint


app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(pet_blueprint, url_prefix='/animals')
app.register_blueprint(favoritos_blueprint, url_prefix='/favs')


if __name__ == '__main__':
    app.run(debug=True)