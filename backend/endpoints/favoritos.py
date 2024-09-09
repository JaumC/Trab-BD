# backend/endpoints/favoritos.py

from flask import Blueprint, request, jsonify
from config import db_config
import psycopg2
import base64
import os


favoritos_blueprint = Blueprint('favoritos', __name__)


# Conectar ao banco de dados
def get_db_connection():
    conn = psycopg2.connect(**db_config)
    return conn


def read_image_as_base64(file_path):
    try:
        with open(file_path, "rb") as image_file:
            image_bytes = image_file.read()
            return base64.b64encode(image_bytes).decode('utf-8')
    except FileNotFoundError:
        return None
    

@favoritos_blueprint.route('/favoritos', methods=['POST'])
def add_favorito():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        data = request.json
        cursor.execute("INSERT INTO favoritos (usuarioId, animalId) VALUES (%s, %s)", 
                       (data['usuarioId'], data['animalId']))
        conn.commit()
        
        return jsonify({'message': 'Favorito added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': f'Erro ao adicionar favorito: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@favoritos_blueprint.route('/favoritos/<int:user_id>/<int:animal_id>', methods=['GET'])
def check_favorito(user_id, animal_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM favoritos WHERE usuarioId = %s AND animalId = %s", (user_id, animal_id))
        favorito = cursor.fetchone()
        
        return jsonify({'isFavorite': bool(favorito)}), 200
    except Exception as e:
        return jsonify({'DENY': f'Erro ao verificar favorito: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@favoritos_blueprint.route('/favoritos/<int:user_id>/<int:animal_id>', methods=['DELETE'])
def remove_favorito(user_id, animal_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM favoritos WHERE usuarioId = %s AND animalId = %s", 
                       (user_id, animal_id))
        if cursor.rowcount > 0:
            conn.commit()
            return jsonify({'message': 'Favorito removed successfully'}), 200
        else:
            return jsonify({'message': 'Favorito not found'}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': f'Erro ao remover favorito: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@favoritos_blueprint.route('/favoritos/<int:user_id>', methods=['GET'])
def get_favoritos(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT a.id, a.nomeAnimal, a.animalFoto, a.disponivel
            FROM animais a
            JOIN favoritos f ON a.id = f.animalId
            WHERE f.usuarioId = %s
        """, (user_id,))
        favoritos = cursor.fetchall()

        favoritos_list = []
        for pet in favoritos:
            animal_foto_base64 = None
            image_path = pet[2]  # Acesso ao caminho do arquivo

            if image_path:
                # Verifique se o caminho da imagem está em formato binário
                if isinstance(image_path, memoryview):
                    image_path = image_path.tobytes().decode('utf-8')

                # Certifique-se de que o caminho está correto
                full_image_path = os.path.join('/app/uploads', image_path)

                if os.path.isfile(full_image_path):
                    animal_foto_base64 = read_image_as_base64(full_image_path)
                    if animal_foto_base64:
                        animal_foto_base64 = f"data:image/jpeg;base64,{animal_foto_base64}"
                else:
                    print(f'Caminho da imagem inválido: {full_image_path}', flush=True)
            else:
                print(f'Nenhum caminho de imagem fornecido para o pet com ID: {pet[0]}', flush=True)

            pet_data = {
                'id': pet[0],
                'nomeAnimal': pet[1],
                'animalFoto': animal_foto_base64,
                'disponivel': pet[3]
            }
            favoritos_list.append(pet_data)

        return jsonify({'pets': favoritos_list}), 200
    except Exception as e:
        return jsonify({'DENY': f'Erro ao buscar favoritos: {e}'}), 500
    finally:
        cursor.close()
        conn.close()