
CREATE DATABASE pdv;


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome text NOT NULL,
    email text UNIQUE NOT NULL,
    senha text NOT NULL
);


CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao text NOT NULL
);


CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    quantidade_estoque INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id)
);


CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    cep TEXT,
    rua TEXT,
    numero TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT
);

ALTER TABLE produtos
ADD COLUMN imagem_url TEXT;


CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    observacao TEXT,
    valor_total DECIMAL(10, 2) NOT NULL
);


CREATE TABLE pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade_produto INTEGER NOT NULL,
    valor_produto DECIMAL(10, 2) NOT NULL
);