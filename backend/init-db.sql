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
    animalFoto BYTEA,
    userId INTEGER,
    CONSTRAINT fk_usuario
        FOREIGN KEY (userId) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    usuarioId INTEGER,
    CONSTRAINT fk_usuario
        FOREIGN KEY (usuarioId) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        -- Enforce uniqueness of the combination of rua, numero, bairro, cep
        --UNIQUE (rua, numero, bairro, cep)
        -- Enforce uniqueness of the combination of cidade, estado
        --UNIQUE (cidade, estado)
);


CREATE TABLE IF NOT EXISTS adocao(
    id SERIAL PRIMARY KEY,
    dataAdocao DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    animalId INTEGER,
    usuarioId INTEGER,
    CONSTRAINT fk_usuario_adocao
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_animal
        FOREIGN KEY (animalId) 
        REFERENCES animais(id)
        ON DELETE CASCADE,  
);


CREATE TABLE IF NOT EXISTS favoritos(
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER,
    animalId INTEGER,
    CONSTRAINT fk_usuario_favorito
    FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_animal_favorito
    FOREIGN KEY (animalId) 
        REFERENCES animais(id)
        ON DELETE CASCADE
    UNIQUE (usuarioId, animalId);
);


CREATE TABLE IF NOT EXISTS chat(
    id SERIAL PRIMARY KEY,
    usuario1 INTEGER,
    usuario2 INTEGER,
    CONSTRAINT fk_usuario1
    FOREIGN KEY (usuario1)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario2
    FOREIGN KEY (usuario2)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_unique_chat
    UNIQUE (usuario1, usuario2);
);

CREATE TABLE IF NOT EXISTS mensagem(
    id SERIAL PRIMARY KEY,
    chatId INTEGER,
    usuarioId INTEGER,
    conteudo TEXT NOT NULL,
    dataEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat
    FOREIGN KEY (chatId)
        REFERENCES chat(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario
    FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        -- Enforce uniqueness of the combination of chatId and usuarioId
        UNIQUE (chatId, usuarioId)
        -- Enforce order by dataEnvio
        ORDER BY dataEnvio ASC
);


