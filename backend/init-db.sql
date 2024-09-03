CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    idade VARCHAR(10),
    email VARCHAR(255) UNIQUE NOT NULL,
    estado VARCHAR(50),
    cidade VARCHAR(50),
    endereco TEXT,
    telefone VARCHAR(20) UNIQUE,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS animais (
    id SERIAL PRIMARY KEY,
    nomeAnimal VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    porte VARCHAR(50) NOT NULL,
    idade VARCHAR(20) NOT NULL,
    temperamento VARCHAR(100),
    saude VARCHAR(100),
    sobreAnimal TEXT,
    animalFoto TEXT,
    userId INTEGER,
    CONSTRAINT fk_usuario
        FOREIGN KEY (userId) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);