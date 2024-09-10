# backend/endpoints/pet.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import Config, db_config
import psycopg2
import base64
import uuid
import os


pet_blueprint = Blueprint('pet', __name__)


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
    
    
@pet_blueprint.route('/register-animal', methods=['POST'])
def register_animal():
    data = request.json

    # Conectar ao banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()

    nomeAnimal = data.get('nomeAnimal')
    especie = data.get('especie')
    sexo = data.get('sexo')
    porte = data.get('porte')
    idade = data.get('idade')
    temperamento = data.get('temperamento')
    saude = data.get('saude')
    sobreAnimal = data.get('sobreAnimal')
    imagem_base64 = data.get('animalFoto')
    userId = data.get('usuario_id')

    image_bytes = None
    file_url = ''

    if imagem_base64:
        image_data = imagem_base64.split(",")[1]
        image_bytes = base64.b64decode(image_data)

        unique_filename = f"{uuid.uuid4().hex}.jpeg"
        safe_filename = secure_filename(unique_filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, safe_filename)

        with open(file_path, 'wb') as f:
            f.write(image_bytes)
        file_url = safe_filename  # Caminho da imagem

    # Converter caminho do arquivo para binário
    binary_file_path = file_url.encode('utf-8')

    try:
        cursor.execute("""
            INSERT INTO animais (nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, animalFoto, userId)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, binary_file_path, userId))
        conn.commit()
        return jsonify({'OK': 'Animal cadastrado com sucesso!'})
    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': f'Erro ao cadastrar animal: {e}'})
    finally:
        cursor.close()
        conn.close()


@pet_blueprint.route('/meus-pets/<int:user_id>', methods=['GET'])
def meus_pets(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'DENY': 'User ID inválido'}), 400

    try:
        cursor.execute("SELECT * FROM animais WHERE userId = %s", (user_id,))
        pets = cursor.fetchall()

        if pets:
            pets_list = []
            for pet in pets:
                animal_foto_base64 = None
                image_path = pet[9]  # Acesso ao caminho do arquivo

                if image_path:
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
                    'especie': pet[2],
                    'sexo': pet[3],
                    'porte': pet[4],
                    'idade': pet[5],
                    'temperamento': pet[6],
                    'saude': pet[7],
                    'sobreAnimal': pet[8],
                    'animalFoto': animal_foto_base64,
                    'userId': pet[10],
                    'disponivel': pet[11]
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


@pet_blueprint.route('/info-pets/<int:petId>', methods=['GET'])
def info_pets(petId):
    print('aa', flush=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM vw_detalhes_animal WHERE animal_id = %s", (petId,))
        pet = cursor.fetchone()

        if pet:
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
                'animalFotoStatus': pet[9],
                'dono_id': pet[10],
                'dono_nome': pet[11],
                'disponivel': pet[12],
            }

            return jsonify({'OK': pet_data}), 200
        
        else:
            return jsonify({'DENY': 'Pet não encontrando'}), 404
    
    except Exception as e:
        return jsonify({'DENY': f'Erro ao buscar informações do pet{e}'})
    finally:
        cursor.close()
        conn.close()
    

@pet_blueprint.route('/pet-delete/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, nomeAnimal FROM animais WHERE id = %s", (pet_id,))
        animal = cursor.fetchone()

        if animal:
            animal_id, nomeAnimal = animal
            cursor.execute("DELETE FROM animais WHERE id = %s", (animal_id,))
            conn.commit()

            response = {'OK': f'{nomeAnimal} excluído! Redirecionando...'}
            return jsonify(response), 200
        
        else:
            return jsonify({'DENY': 'Pet não encontrado!'}), 404
        
    except Exception as e:
        return jsonify({'Erro': f'Ocorreu um erro: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()


@pet_blueprint.route('/pet-details/<int:petId>', methods=['GET'])
def get_pet_details(petId):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT *
            FROM animais
            WHERE id = %s
        """, (petId,))
        pet = cursor.fetchone()
        
        if pet:
            animal_foto_base64 = None
            image_path = pet[9]  # Acesso ao caminho do arquivo

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

            return jsonify({
               'id': pet[0],
                'nomeAnimal': pet[1],
                'especie': pet[2],
                'sexo': pet[3],
                'porte': pet[4],
                'idade': pet[5],
                'temperamento': pet[6],
                'saude': pet[7],
                'sobreAnimal': pet[8],
                'animalFoto': animal_foto_base64,
                'userId': pet[10],
                'disponivel' : pet[11]
            }), 200
        else:
            return jsonify({'DENY': 'Pet não encontrado'}), 404
    except Exception as e:
        return jsonify({'DENY': f'Erro ao atualizar detalhes do pet: {e}'}), 500
    finally:
        cursor.close()
        conn.close()


@pet_blueprint.route('/pet-update/<int:pet_id>', methods=['PUT'])
def update_pet_details(pet_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    data = request.json

    # Inicie a parte do SET da consulta SQL
    set_clause = []
    params = []

    # Adicione os campos fornecidos à cláusula SET
    if 'nomeAnimal' in data:
        set_clause.append("nomeAnimal = %s")
        params.append(data['nomeAnimal'])
    if 'especie' in data:
        set_clause.append("especie = %s")
        params.append(data['especie'])
    if 'sexo' in data:
        set_clause.append("sexo = %s")
        params.append(data['sexo'])
    if 'porte' in data:
        set_clause.append("porte = %s")
        params.append(data['porte'])
    if 'idade' in data:
        set_clause.append("idade = %s")
        params.append(data['idade'])
    if 'temperamento' in data:
        set_clause.append("temperamento = %s")
        params.append(data['temperamento'])
    if 'saude' in data:
        set_clause.append("saude = %s")
        params.append(data['saude'])
    if 'sobreAnimal' in data:
        set_clause.append("sobreAnimal = %s")
        params.append(data['sobreAnimal'])

    if not set_clause:
        return jsonify({'DENY': 'Sem alterações fornecidas'}), 400

    # Construa a consulta SQL
    sql = f"""
        UPDATE animais
        SET {', '.join(set_clause)}
        WHERE id = %s
    """
    params.append(pet_id)

    try:
        cursor.execute(sql, tuple(params))
        conn.commit()
        
        return jsonify({'OK': 'Pet atualizado com sucesso!'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'DENY': f'Erro ao atualizar pet: {e}'}), 500
    finally:
        cursor.close()
        conn.close()