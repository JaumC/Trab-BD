from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurações do banco de dados
db_config = {
    'dbname': 'nome_do_banco',
    'user': 'usuario_do_banco',
    'password': 'senha_do_banco',
    'host': 'db',  # ou 'db' se estiver usando Docker
    'port': '5432'
}

# Conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(**db_config)
    return conn

@app.route('/sign-data', methods=['POST'])
def sign_data():
    data = request.json  # Recebe os dados do React em formato JSON
    
    # Conectar ao banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Inserir os dados no banco de dados
        cursor.execute("""
            INSERT INTO usuarios (nome_completo, idade, email, estado, cidade, endereco, telefone, nome_usuario, senha)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nome_completo'],
            data['idade'],
            data['email'],
            data['estado'],
            data['cidade'],
            data['endereco'],
            data['telefone'],
            data['nome_usuario'],
            data['senha']
        ))

        conn.commit()
        response = {'message': 'Dados cadastrados com sucesso!'}
    except Exception as e:
        conn.rollback()
        response = {'message': f'Erro ao cadastrar os dados: {e}'}
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)