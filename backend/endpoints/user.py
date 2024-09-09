# backend/endpoints/user.py

from flask import Blueprint, request, jsonify
import psycopg2
from config import db_config


user_blueprint = Blueprint('user', __name__)


# Conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(**db_config)
    return conn


@user_blueprint.route('/sign-data', methods=['POST'])
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
                INSERT INTO usuarios (nome_completo, data_nasc, email, estado, cidade, endereco, telefone, nome_usuario, senha)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['nome_completo'],
                data['data'],
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


@user_blueprint.route('/login-data', methods=['POST'])
def login_data():
    data = request.json  # Recebe os dados do React em formato JSON

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
        response = {'DENY': f'Erro ao realizar login: {e}'}
        return jsonify(response), 500

    finally:
        cursor.close()
        conn.close()



@user_blueprint.route('/user-info/<int:user_id>', methods=['GET'])
def user_info(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'DENY': 'User ID inválido'}), 400


    try:
        cursor.execute("""
            SELECT *, calcIdade(data_nasc) AS idade
            FROM usuarios
            WHERE id = %s
        """, (user_id,))
        user = cursor.fetchone()

        if user:
            return jsonify({                
                'user_id': user[0],
                'nome_completo': user[1],
                'data_nasc': user[2],
                'idade': user[10],
                'email': user[3],
                'estado': user[4],
                'cidade': user[5],
                'endereco': user[6],
                'telefone': user[7],
                'nome_usuario': user[8]}), 200
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


@user_blueprint.route('/user-delete/<int:user_id>', methods=['DELETE'])
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