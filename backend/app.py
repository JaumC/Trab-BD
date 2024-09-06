from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import psycopg2
import base64
import os

# Configuração básica do Flask
app = Flask(__name__)
CORS(app)

# Diretório para salvar arquivos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Caminho absoluto para o diretório onde app.py está localizado
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Cria o diretório se ele não existir

# Limitar o tamanho do upload e configurar o diretório de upload
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000  # por exemplo, limitando o tamanho do arquivo para 16MB
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
        # Verificar se o e-mail já existe no banco de dados
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (data['email'],))

        # Pega a primeira ocorrencia encontrada
        existing_user = cursor.fetchone()

        if existing_user:
            response = {'DENY': 'Este e-mail já está cadastrado. Por favor, insira outro'}
            return jsonify(response)

        else:
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
            response = {'OK': 'Dados cadastrados com sucesso!'}

    except Exception as e:
        conn.rollback()
        response = {'DENY': f'Erro ao cadastrar os dados: {e}'}
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)


@app.route('/register-animal', methods=['POST'])
def register_animal():
    data = request.json  # Recebe os dados do React em formato JSON

    # Conectar ao banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()

    # Recebe dados do formulário, exceto o arquivo
    nomeAnimal = data.get('nomeAnimal')
    especie = data.get('especie')
    sexo = data.get('sexo')
    porte = data.get('porte')
    idade = data.get('idade')
    temperamento = data.get('temperamento')
    saude = data.get('saude')
    sobreAnimal = data.get('sobreAnimal')
    imagem_base64 = data.get('animalFoto')
    userId = data.get('usuario_id')  # Obtém o ID do usuário do React

    image_bytes = None

    if imagem_base64:
        image_data = imagem_base64.split(",")[1]
        image_bytes = base64.b64decode(image_data) # Remove o prefixo da string Base64

        
        # Salva a imagem em um diretório de uploads
        filename = 'uploaded_image.jpeg'
        safe_filename = secure_filename(filename)
        file_path = os.path.join(UPLOAD_FOLDER, safe_filename)

        with open(file_path, 'wb') as f:
            f.write(image_bytes)
        file_url = file_path
    else:
        file_url = ''  # ou o caminho necessário para o arquivo sem imagem

    try:
        cursor.execute("""
            INSERT INTO animais (nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, animalFoto, userId)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, file_url, userId))
        conn.commit()
        return jsonify({'OK': 'Animal cadastrado com sucesso!'})
    except Exception as e:
        conn.rollback()
        print(f'Erro ao cadastrar animal:{e}', flush=True)
        return jsonify({'DENY': f'Erro ao cadastrar animal: {e}'})
    finally:
        cursor.close()
        conn.close()

@app.route('/login-data', methods=['POST'])
def login_data():
    data = request.json  # Recebe os dados do React em formato JSON

    app.logger.info(f'Received login data: {data}')

    # Conectar ao banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nome_usuario FROM usuarios WHERE nome_usuario = %s AND senha = %s", (data['nome_usuario'], data['senha']))

        # Pega a primeira ocorrencia encontrada
        user = cursor.fetchone()

        if user:
            user_id, nome_usuario = user
            response = {'OK': 'Login realizado com sucesso!', 'user_id': user_id, 'nome_usuario': nome_usuario}
            return jsonify(response), 200
        else:
            response = {'DENY': 'Nome de usuários não encontrados.'}
            return jsonify(response), 401

    except Exception as e:
        app.logger.error(f'Error during login: {str(e)}') #Loggin Error
        response = {'DENY': f'Erro ao realizar login: {e}'}
        return jsonify(response), 500

    finally:
        cursor.close()
        conn.close()



@app.route('/user-info/<int:user_id>', methods=['GET'])
def user_info(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'DENY': 'User ID inválido'}), 400


    try:
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            return jsonify({'user_id': user[0], 'nome_completo': user[1], 'idade': user[2], 'email': user[3], 'estado': user[4], 'cidade': user[5], 'endereco': user[6], 'telefone': user[7], 'nome_usuario': user[8],}), 200
        else:
            return jsonify({'DENY': 'Usuário não encontrado'}), 404
        
    except Exception as e:
        return jsonify({'DENY': f'Erro ao buscar informações do usuário: {e}'}), 500

    finally:
        cursor.close()
        conn.close()


@app.route('/user-update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Construindo a string SQL de atualização com os dados recebidos
        update_parts = [f"{key} = %s" for key in data.keys()]
        update_statement = ", ".join(update_parts)

        # Valores a serem inseridos na query
        values = list(data.values())

        print(values, flush=True)
        # Executando a atualização no banco de dados
        cursor.execute(
            f"UPDATE usuarios SET {update_statement} WHERE id = %s",
            (*values, user_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'DENY': 'Usuário não encontrado.'}), 404

        return jsonify({'OK': 'Dados do usuário atualizados com sucesso.'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': 'Erro ao atualizar os dados do usuário.', 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/user-delete/<int:user_id>', methods=['DELETE'])
def user_delete(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nome_usuario FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            user_id, nome_usuario = user
            cursor.execute("DELETE FROM usuarios WHERE id = %s", (user_id,))
            conn.commit()

            response = {'OK': f'{nome_usuario} excluído! Redirecionando...'}
            return jsonify(response), 200
        
        else:
            return jsonify({'DENY': 'Usuário não encontrado!'}), 404
        
    except Exception as e:
        return jsonify({'Erro': f'Ocorreu um erro: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

def read_image_as_base64(file_path):
    try:
        with open(file_path, "rb") as image_file:
            image_bytes = image_file.read()
            return base64.b64encode(image_bytes).decode('utf-8')
    except FileNotFoundError:
        return None

def read_image_as_base64(file_path):
    """Lê a imagem do caminho fornecido e retorna o conteúdo em base64."""
    if not os.path.isfile(file_path):
        print(f'Arquivo não encontrado: {file_path}', flush=True)
        return None

    try:
        with open(file_path, "rb") as image_file:
            image_bytes = image_file.read()
            return base64.b64encode(image_bytes).decode('utf-8')
    except Exception as e:
        print(f'Erro ao ler o arquivo: {e}', flush=True)
        return None

@app.route('/meus-pets/<int:user_id>', methods=['GET'])
def meus_pets(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'DENY': 'User ID inválido'}), 400

    try:
        # Consulta para buscar os animais associados ao user_id
        cursor.execute("SELECT * FROM animais WHERE userId = %s", (user_id,))
        pets = cursor.fetchall()

        if pets:
            pets_list = []
            for pet in pets:
                animal_foto_base64 = None
                image_path = pet[9]  # Acesso ao caminho do arquivo

                # Verifica se `image_path` é um memoryview e converte para bytes
                if isinstance(image_path, memoryview):
                    image_path = image_path.tobytes().decode('utf-8')  # Converte memoryview para string

                # Verifica se `image_path` é uma string e o arquivo existe
                if isinstance(image_path, str) and os.path.isfile(image_path):
                    animal_foto_base64 = read_image_as_base64(image_path)
                    if animal_foto_base64:
                        animal_foto_base64 = f"data:image/jpeg;base64,{animal_foto_base64}"  # Adiciona prefixo de data URI
                else:
                    print(f'Caminho da imagem inválido: {image_path}', flush=True)

                pet_data = {
                    'id': pet[0],
                    'nomeAnimal': pet[1],
                    'especie': pet[2],
                    'sexo': pet[3],
                    'porte': pet[4],
                    'idade': pet[5],
                    'temperamento': pet[6],
                    'saude': pet[7],
                    'sobreAnimal': pet[8],
                    'animalFoto': animal_foto_base64,  # Envia a imagem como Base64
                    'userId': pet[10]
                }
                pets_list.append(pet_data)

            return jsonify({'pets': pets_list}), 200
        else:
            return jsonify({'DENY': 'Nenhum pet encontrado para este usuário'}), 404

    except Exception as e:
        print(f'Erro ao buscar os pets: {e}', flush=True)
        return jsonify({'DENY': f'Erro ao buscar os pets: {e}'}), 500

    finally:
        cursor.close()
        conn.close()



if __name__ == '__main__':
    app.run(debug=True)