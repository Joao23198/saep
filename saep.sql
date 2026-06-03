-- Criação do banco de dados
DROP DATABASE IF EXISTS saep_db;
CREATE DATABASE saep_db;
USE saep_db;

-- ==========================
-- Tabela de Usuários
-- ==========================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL
);

-- ==========================
-- Tabela de Produtos
-- ==========================
CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    estoque_minimo INT NOT NULL,
    quantidade_atual INT NOT NULL
);

-- ==========================
-- Tabela de Movimentações
-- ==========================
CREATE TABLE movimentacao (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo ENUM('entrada','saida') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    CONSTRAINT fk_mov_prod FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto)
        ON DELETE CASCADE,
    CONSTRAINT fk_mov_user FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

-- ==========================
-- População mínima exigida
-- ==========================

-- Usuários (3 registros)
INSERT INTO usuario (nome, login, senha) VALUES
('João Silva', 'joao', '1234'),
('Maria Souza', 'maria', 'abcd'),
('Carlos Pereira', 'carlos', 'senha');

-- Produtos (3 registros)
INSERT INTO produto (nome, descricao, estoque_minimo, quantidade_atual) VALUES
('Martelo de aço', 'Ferramenta de impacto', 5, 10),
('Chave de fenda isolada', 'Ferramenta com isolamento elétrico', 3, 8),
('Alicate universal', 'Ferramenta de corte e aperto', 4, 6);

-- Movimentações (3 registros)
INSERT INTO movimentacao (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'saida', 3, '2026-06-01'),
(2, 2, 'entrada', 5, '2026-06-01'),
(3, 3, 'saida', 2, '2026-06-01');
