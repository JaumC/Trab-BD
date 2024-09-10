CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    data_nasc DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    estado VARCHAR(50),
    cidade VARCHAR(50),
    endereco TEXT,
    telefone VARCHAR(20),
    nome_usuario VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    usuarioId INTEGER,
    CONSTRAINT fk_usuario_endereco
        FOREIGN KEY (usuarioId) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS animais (
    id SERIAL PRIMARY KEY,
    nomeAnimal VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    porte VARCHAR(50) NOT NULL,
    idade VARCHAR(50),
    temperamento VARCHAR(100),
    saude VARCHAR(100),
    sobreAnimal TEXT,
    animalFoto BYTEA,
    usuarioId INTEGER,
    disponivel BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_usuario_animais
        FOREIGN KEY (usuarioId) 
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS favoritos (
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
);


CREATE TABLE IF NOT EXISTS adocao (
    id SERIAL PRIMARY KEY,
    dataAdocao DATE NOT NULL,
    statusAdocao VARCHAR(50) NOT NULL,
    animalId INTEGER,
    usuarioId INTEGER,
    CONSTRAINT fk_usuario_adocao
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_animal_adocao
        FOREIGN KEY (animalId) 
        REFERENCES animais(id)
        ON DELETE CASCADE  
);

CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    usuario1 INTEGER,
    usuario2 INTEGER,
    CONSTRAINT fk_usuario1_chat
        FOREIGN KEY (usuario1)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario2_chat
        FOREIGN KEY (usuario2)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mensagem (
    id SERIAL PRIMARY KEY,
    chatId INTEGER,
    usuarioId INTEGER,
    conteudo TEXT NOT NULL,
    dataEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_msg
        FOREIGN KEY (chatId)
        REFERENCES chat(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario_msg
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS visita(
    id SERIAL PRIMARY KEY,
    animalId INTEGER,
    usuarioId INTEGER,
    data_visita DATE NOT NULL,
    CONSTRAINT fk_animal_visita
        FOREIGN KEY (animalId)
        REFERENCES animais(id),
    CONSTRAINT fk_usuario_visita
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS historico_medico(
    id SERIAL PRIMARY KEY,
    animalId INTEGER,
    doenças VARCHAR(300) NOT NULL,
    CONSTRAINT fk_animal_historico
        FOREIGN KEY (animalId)
        REFERENCES animais(id)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS necessidades (
    id SERIAL PRIMARY KEY,
    animalId INTEGER,
    objeto VARCHAR(200),
    medicamentos VARCHAR(500),
    CONSTRAINT fk_animal_necessidades
        FOREIGN KEY (animalId) 
        REFERENCES animais(id) 
        ON DELETE CASCADE
);


CREATE VIEW vw_detalhes_animal AS
SELECT
    a.id AS animal_id,
    a.nomeAnimal,
    a.especie,
    a.sexo,
    a.porte,
    a.idade,
    a.temperamento,
    a.saude,
    a.sobreAnimal,
    CASE
        WHEN a.animalFoto IS NOT NULL THEN 'Imagem Disponível'
        ELSE 'Imagem Indisponível'
    END AS animalFotoStatus,
    a.userId AS dono_id,
    u.nome_completo AS dono_nome,
    a.disponivel
FROM
    animais a
JOIN
    usuarios u ON a.userId = u.id;


CREATE OR REPLACE FUNCTION calcIdade(data_nasc DATE)
RETURNS INTEGER AS $$
DECLARE 
    idade INTEGER;
BEGIN
    idade := EXTRACT(YEAR FROM AGE(data_nasc));
    RETURN idade;
END;
$$ LANGUAGE plpgsql;


INSERT INTO animais (
    nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, animalFoto, userId, disponivel
) VALUES
('Bolinha', 'Cachorro', 'Fêmea', 'Pequeno', 'Adulto', 'Brincalhão, Amoroso', 'Vacinado', 'Bolinha é um cachorro pequeno e muito brincalhão. Adora estar perto de pessoas e brincar com brinquedos.', NULL, 34, TRUE),
('Sombra', 'Gato', 'Macho', 'Médio', 'Idoso', 'Calmo, Preguiçoso', 'Castrado, Vermifugado', 'Sombra é um gato idoso, muito calmo e preguiçoso. Passa a maior parte do tempo dormindo em lugares quentinhos.', NULL, 35, TRUE),
('Thor', 'Cachorro', 'Macho', 'Pequeno', 'Filhote', 'Guarda, Brincalhão', 'Vacinado, Castrado', 'Thor é um cachorro adulto, muito leal e protetor. Gosta de brincar, mas também de ficar alerta.', NULL, 1, TRUE),
('Spike', 'Cachorro', 'Macho', 'Grande', 'Adulto', 'Guarda, Amoroso', 'Vacinado, Castrado', 'Spike é um cachorro grande e amoroso que gosta de brincar.', NULL, 1, TRUE);




INSERT INTO usuarios (nome_completo, data_nasc, email, estado, cidade, endereco, telefone, nome_usuario, senha) 
VALUES 
('Pedro Henrique', '2008-08-15', 'PedroHH@hotmail.com', 'BH', 'Porto de Galinhas', 'Quadra 14', '9898989898', 'PedroH', 'P3dr0@@$'),
('Maria Silva', '2001-08-22', 'MariaS22@gmail.com', 'SP', 'São Paulo', 'Avenida Paulista', '9797979797', 'MariaS', 'S3nh@_Maria'),
('João Oliveira', '1993-08-30', 'JoaoO30@yahoo.com', 'RJ', 'Rio de Janeiro', 'Rua das Flores', '9696969696', 'JoaoO', 'Joao#2024'),
('Mateus Machado', '2008-08-15', 'MachadoMateus@gmail.com', 'DF', 'Ceilândia', 'Q.5', '555555555', 'Machadinho', 'm@ch4d1nh0##');

