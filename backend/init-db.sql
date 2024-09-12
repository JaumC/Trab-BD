-- Criação de todas as tabelas

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    data_nasc DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    nome_usuario VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    idade INTEGER, 
    endereco_completo TEXT
);

CREATE TABLE IF NOT EXISTS endereco (
    id SERIAL PRIMARY KEY,
    rua VARCHAR(50) NOT NULL,
    quadra VARCHAR(40) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(30) NOT NULL, 
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

----------------------------------------------------------------------

-- Criação da Procedure que calcula a idade
CREATE OR REPLACE PROCEDURE calcIdade_proc(data_nasc DATE, OUT idade INTEGER)
LANGUAGE plpgsql AS $$
BEGIN
    idade := EXTRACT(YEAR FROM AGE(data_nasc));
END;
$$;

-- Criação da Procedure que forma o Endereço Completo
CREATE OR REPLACE PROCEDURE endereco_completo_proc(usuario_id INTEGER, OUT endereco_txt TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    SELECT CONCAT(rua, ', ', quadra, ', ', cidade, ', ', estado, ', ', complemento) INTO endereco_txt
    FROM endereco
    WHERE usuarioId = usuario_id;
END;
$$;

-- Procedure para atualizar a tabela usuarios com endereço e idade
CREATE OR REPLACE PROCEDURE atualizar_usuarios()
LANGUAGE plpgsql AS $$
DECLARE
    rec RECORD;
    idade_nova INTEGER; 
    endereco_novo TEXT;   
BEGIN
    FOR rec IN SELECT id, data_nasc FROM usuarios LOOP
        -- Calcula a idade
        CALL calcIdade_proc(rec.data_nasc, idade_nova);
        
        -- Calcula o endereço completo
        CALL endereco_completo_proc(rec.id, endereco_novo);
        
        -- Atualiza a tabela usuarios
        UPDATE usuarios
        SET idade = idade_nova, 
            endereco_completo = endereco_novo  
        WHERE id = rec.id;
        
    END LOOP;
END;
$$;

-----------------------------------------------------------------------------------------

-- Inserts de 5 valores nas tabelas --
-- Usuários:
INSERT INTO usuarios (nome_completo, data_nasc, email, telefone, nome_usuario, senha) 
VALUES 
('Pedro Henrique', '2008-08-15', 'PedroHH@hotmail.com', '9898989898', 'PedroH', 'P3dr0@@$'),
('Maria Silva', '2001-08-22', 'MariaS22@gmail.com', '9797979797', 'MariaS', 'S3nh@_Maria'),
('João Oliveira', '1993-08-30', 'JoaoO30@yahoo.com', '9696969696', 'JoaoO', 'Joao#2024'),
('Mateus Machado', '2008-08-15', 'MachadoMateus@gmail.com', '555555555', 'Machadinho', 'm@ch4d1nh0##'),
('Ana Paula', '1985-12-05', 'AnaPaula@example.com', '988888888', 'AnaP', 'AnaP@ss2024');

-- Endereços:
INSERT INTO endereco (rua, quadra, estado, cidade, complemento, usuarioId)
VALUES 
('Rua das Acácias', 'Quadra 14', 'MG', 'Belo Horizonte', '12', 1),
('Rua das Flores', 'Quadra 7', 'RJ', 'Rio de Janeiro', '20', 2),
('Avenida Paulista', 'Avenida 3', 'SP', 'São Paulo', '50', 3),
('Quadra 14', 'Quadra 5', 'BH', 'Porto de Galinhas', '17', 4),
('Rua São José', 'Quadra 2', 'MG', 'Belo Horizonte', '21', 5);

-- Atualizar a tabela usuarios com idade e endereco completo
CALL atualizar_usuarios();

-- Animais:
INSERT INTO animais (nomeAnimal, especie, sexo, porte, idade, temperamento, saude, sobreAnimal, animalFoto, usuarioId, disponivel)
VALUES 
('Bolinha', 'Cachorro', 'Fêmea', 'Pequeno', 'Adulto', 'Brincalhão, Amoroso', 'Vacinado', 'Bolinha é um cachorro pequeno e muito brincalhão. Adora estar perto de pessoas e brincar com brinquedos.', NULL, 1, TRUE),
('Sombra', 'Gato', 'Macho', 'Médio', 'Idoso', 'Calmo, Preguiçoso', 'Castrado, Vermifugado', 'Sombra é um gato idoso, muito calmo e preguiçoso. Passa a maior parte do tempo dormindo em lugares quentinhos.', NULL, 2, TRUE),
('Thor', 'Cachorro', 'Macho', 'Pequeno', 'Filhote', 'Guarda, Brincalhão', 'Vacinado, Castrado', 'Thor é um cachorro adulto, muito leal e protetor. Gosta de brincar, mas também de ficar alerta.', NULL, 3, TRUE),
('Spike', 'Cachorro', 'Macho', 'Grande', 'Adulto', 'Guarda, Amoroso', 'Vacinado, Castrado', 'Spike é um cachorro grande e amoroso que gosta de brincar.', NULL, 4, TRUE),
('Luna', 'Gato', 'Fêmea', 'Pequeno', 'Adulto', 'Curiosa, Afetuosa', 'Castrada', 'Luna é uma gata curiosa e muito afetuosa. Adora brincar com brinquedos e receber carinho.', NULL, 5, TRUE);

-- Favoritos:
INSERT INTO favoritos (usuarioId, animalId)
VALUES 
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5);

-- Adoção:
INSERT INTO adocao (dataAdocao, statusAdocao, animalId, usuarioId)
VALUES 
('2024-08-01', 'Concluída', 1, 1),
('2024-08-15', 'Pendente', 2, 2),
('2024-09-01', 'Concluída', 3, 3),
('2024-09-10', 'Cancelada', 4, 4),
('2024-09-20', 'Pendente', 5, 5);

-- Chat:
INSERT INTO chat (usuario1, usuario2)
VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- Mensagem:
INSERT INTO mensagem (chatId, usuarioId, conteudo, dataEnvio)
VALUES 
(1, 1, 'Oi, tudo bem?', '2024-09-01 10:00:00'),
(1, 2, 'Tudo sim, e você?', '2024-09-01 10:05:00'),
(2, 2, 'Vamos marcar uma visita?', '2024-09-02 11:00:00'),
(3, 3, 'Olha esse animal que encontrei!', '2024-09-03 12:00:00'),
(4, 4, 'Preciso de informações sobre a adoção.', '2024-09-04 13:00:00');

-- Visita:
INSERT INTO visita (animalId, usuarioId, data_visita)
VALUES 
(1, 1, '2024-08-10'),
(2, 2, '2024-08-20'),
(3, 3, '2024-09-05'),
(4, 4, '2024-09-15'),
(5, 5, '2024-09-25');

-- Histórico Médico:
INSERT INTO historico_medico (animalId, doenças)
VALUES 
(1, 'Nenhuma'),
(2, 'Felicidade em dia'),
(3, 'Alergia leve'),
(4, 'Castrado recentemente'),
(5, 'Vermifugação');

-- Necessidades:
INSERT INTO necessidades (animalId, objeto, medicamentos)
VALUES 
(1, 'Coleira', 'Nenhum'),
(2, 'Brinquedo', 'Vitaminas'),
(3, 'Cama', 'Anti-inflamatório'),
(4, 'Ração', 'Suplemento'),
(5, 'Arranhador', 'Nenhum');

------------------------------------------------------------------------------

-- View vw_detalhes_animal responsavél por apresentar os dados e informações dos pets
CREATE OR REPLACE VIEW vw_detalhes_animal AS
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
    a.usuarioId AS dono_id,
    u.nome_completo AS dono_nome,
    u.idade AS dono_idade,
    u.endereco_completo AS dono_endereco,
    a.disponivel
FROM
    animais a
JOIN
    usuarios u ON a.usuarioId = u.id;