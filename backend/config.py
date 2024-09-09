# backend/config.py

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

class Config:
    MAX_CONTENT_LENGTH = 16 * 1000 * 1000  # Limit file size to 16MB
    UPLOAD_FOLDER = UPLOAD_FOLDER

db_config = {
    'dbname': 'meau_pets',
    'user': 'admin_user',
    'password': 'admin',
    'host': 'db',
    'port': '5432'
}
