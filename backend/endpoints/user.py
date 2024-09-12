# backend/endpoints/user.py

from flask import Blueprint, request, jsonify
import psycopg2
from config import db_config


user_blueprint = Blueprint('user', __name__)


# Função para conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(**db_config)
    return conn


@user_blueprint.route('/sign-data', methods=['POST'])
def sign_data():
    data = request.json  # Recebe os dados do React em formato JSON
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Verificar se o e-mail já existe no banco de dados
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (data['email'],))
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({'DENY': 'Este e-mail já está cadastrado. Por favor, insira outro'})

        # Inserir os dados do usuário
        cursor.execute("""
            INSERT INTO usuarios (nome_completo, data_nasc, email, telefone, nome_usuario, senha)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
        """, (
            data['nome_completo'], data['data_nasc'], data['email'], data['telefone'], data['nome_usuario'], data['senha']
        ))
        user_id = cursor.fetchone()[0]

        # Inserir os dados de endereço
        cursor.execute("""
            INSERT INTO endereco (rua, quadra, cidade, estado, complemento, usuarioId)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data['endereco']['rua'], data['endereco']['quadra'], data['endereco']['cidade'], 
            data['endereco']['estado'], data['endereco']['complemento'], user_id
        ))

        # Atualiza a tabela usuarios com idade e endereço completo
        cursor.execute("CALL atualizar_usuarios()")

        conn.commit()
        return jsonify({'OK': 'Dados cadastrados com sucesso!'})

    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': f'Erro ao cadastrar os dados: {e}'})
    finally:
        cursor.close()
        conn.close()


@user_blueprint.route('/login-data', methods=['POST'])
def login_data():
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nome_usuario FROM usuarios WHERE nome_usuario = %s AND senha = %s", 
                       (data['nome_usuario'], data['senha']))
        user = cursor.fetchone()

        if user:
            user_id, nome_usuario = user
            return jsonify({'OK': 'Login realizado com sucesso!', 'user_id': user_id, 'nome_usuario': nome_usuario}), 200
        else:
            return jsonify({'DENY': 'Nome de usuário ou senha incorretos.'}), 401

    except Exception as e:
        return jsonify({'DENY': f'Erro ao realizar login: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@user_blueprint.route('/user-info/<int:user_id>', methods=['GET'])
def user_info(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT u.id, u.nome_completo, u.idade, u.email, u.telefone, u.nome_usuario, 
                   e.estado, e.cidade, e.quadra
            FROM usuarios u
            LEFT JOIN endereco e ON u.id = e.usuarioId
            WHERE u.id = %s
        """, (user_id,))
        
        user = cursor.fetchone()

        if user:
            data = {
                'user_id': user[0],
                'nome_completo': user[1],
                'idade': user[2],
                'email': user[3],
                'telefone': user[4],
                'nome_usuario': user[5],
                'endereco': {
                    'estado': user[6], 
                    'cidade': user[7], 
                    'quadra': user[8]
                }
            }
            return jsonify({'OK': data})
        else:
            return jsonify({'DENY': 'Usuário não encontrado'}), 404

    except Exception as e:
        return jsonify({'DENY': f'Erro ao buscar informações do usuário: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@user_blueprint.route('/user-update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Separar dados de usuário e de endereço
        user_data = {key: value for key, value in data.items() if key in ['nome_completo', 'data_nasc','email', 'telefone', 'nome_usuario']}
        endereco_data = {key: value for key, value in data.items() if key in ['estado', 'cidade', 'quadra']}
        
        # Atualizar dados do usuário
        if user_data:
            update_parts = [f"{key} = %s" for key in user_data.keys()]
            cursor.execute(
                f"UPDATE usuarios SET {', '.join(update_parts)} WHERE id = %s",
                (*user_data.values(), user_id)
            )
        
        # Atualizar dados de endereço
        if endereco_data:
            update_parts = [f"{key} = %s" for key in endereco_data.keys()]
            cursor.execute(
                f"UPDATE endereco SET {', '.join(update_parts)} WHERE usuarioId = %s",
                (*endereco_data.values(), user_id)
            )
        
        # Chamar a procedure para atualizar a idade e o endereço completo
        cursor.execute("CALL atualizar_usuarios()")
        
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


@user_blueprint.route('/user-delete/<int:user_id>', methods=['DELETE'])
def user_delete(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nome_usuario FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if user:
            user_id, nome_usuario = user

            # Deletar o endereço e o usuário
            cursor.execute("DELETE FROM endereco WHERE usuarioId = %s", (user_id,))
            cursor.execute("DELETE FROM usuarios WHERE id = %s", (user_id,))
            conn.commit()

            return jsonify({'OK': f'{nome_usuario} excluído!'}), 200
        else:
            return jsonify({'DENY': 'Usuário não encontrado!'}), 404

    except Exception as e:
        return jsonify({'Erro': f'Ocorreu um erro: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()