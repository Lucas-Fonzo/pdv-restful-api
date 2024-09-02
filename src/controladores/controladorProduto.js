const { pool } = require("../conexao");
const s3Service = require("../storage");
const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;


    if (!descricao || quantidade_estoque === undefined || valor === undefined || !categoria_id) {
        return res
            .status(400)
            .json({ mensagem: "Todos os campos são obrigatórios." });
    }


    if (quantidade_estoque < 0) {
        return res
            .status(400)
            .json({ mensagem: "A quantidade em estoque não pode ser negativa." });
    }

    if (valor < 0) {
        return res
            .status(400)
            .json({ mensagem: "O valor do produto não pode ser negativo." });
    }

    try {
        const queryCategoria = "SELECT * FROM categorias WHERE id = $1";
        const { rowCount: categoriaExiste } = await pool.query(queryCategoria, [
            categoria_id,
        ]);

        if (!categoriaExiste) {
            return res
                .status(400)
                .json({ mensagem: "Categoria informada não existe." });
        }

        const queryInserirProduto = `
            INSERT INTO produtos (descricao, quantidade_estoque, valor, categoria_id)
            VALUES ($1, $2, $3, $4) RETURNING *
        `;
        const { rows } = await pool.query(queryInserirProduto, [
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
        ]);

        return res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const editarProduto = async (req, res) => {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;


    if (!descricao || quantidade_estoque === undefined || valor === undefined || !categoria_id) {
        return res
            .status(400)
            .json({ mensagem: "Todos os campos são obrigatórios." });
    }


    if (quantidade_estoque < 0) {
        return res
            .status(400)
            .json({ mensagem: "A quantidade em estoque não pode ser negativa." });
    }

    if (valor < 0) {
        return res
            .status(400)
            .json({ mensagem: "O valor do produto não pode ser negativo." });
    }

    try {
        const queryProduto = "SELECT * FROM produtos WHERE id = $1";
        const { rowCount: produtoExiste } = await pool.query(queryProduto, [id]);

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        const queryCategoria = "SELECT * FROM categorias WHERE id = $1";
        const { rowCount: categoriaExiste } = await pool.query(queryCategoria, [
            categoria_id,
        ]);

        if (!categoriaExiste) {
            return res
                .status(400)
                .json({ mensagem: "Categoria informada não existe." });
        }

        const queryAtualizarProduto = `
            UPDATE produtos SET descricao = $1, quantidade_estoque = $2, valor = $3, categoria_id = $4
            WHERE id = $5 RETURNING *
        `;
        const { rows } = await pool.query(queryAtualizarProduto, [
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            id,
        ]);

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query;

    try {
        let query = "SELECT * FROM produtos";
        let params = [];

        if (categoria_id) {
            const queryCategoria = "SELECT * FROM categorias WHERE id = $1";
            const { rowCount: categoriaExiste } = await pool.query(queryCategoria, [categoria_id]);

            if (!categoriaExiste) {
                return res
                    .status(400)
                    .json({ mensagem: "Categoria informada não existe." });
            }

            query += " WHERE categoria_id = $1";
            params.push(categoria_id);
        }

        const { rows } = await pool.query(query, params);

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};


const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const query = "SELECT * FROM produtos WHERE id = $1";
        const { rows, rowCount } = await pool.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao detalhar produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const queryProduto = "SELECT * FROM produtos WHERE id = $1";
        const { rows, rowCount: produtoExiste } = await pool.query(queryProduto, [id]);

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        const produto = rows[0];

        if (produto.imagem_url) {
            try {
                await s3Service.excluirArquivo(produto.imagem_url);
            } catch (error) {
                console.error("Erro ao excluir a imagem do produto:", error);

            }
        }

        const queryExcluirProduto = "DELETE FROM produtos WHERE id = $1";
        await pool.query(queryExcluirProduto, [id]);

        return res.status(200).json({ mensagem: "Produto excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};


const atualizarImagemProduto = async (req, res) => {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
        return res
            .status(400)
            .json({ mensagem: "A propriedade imagem é obrigatória." });
    }

    try {
        const queryProduto = "SELECT * FROM produtos WHERE id = $1";
        const { rows, rowCount: produtoExiste } = await pool.query(queryProduto, [
            id,
        ]);

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        const produto = rows[0];
        if (produto.imagem) {
            await s3Service.excluirArquivo(produto.imagem);
        }

        const newImageName = `produtos/${Date.now()}_${file.originalname}`;
        const uploadResult = await s3Service.uploadFile(
            newImageName,
            file.buffer,
            file.mimetype
        );

        const queryAtualizarImagem = `
            UPDATE produtos SET imagem = $1 WHERE id = $2 RETURNING *
        `;
        const { rows: updatedRows } = await pool.query(queryAtualizarImagem, [
            uploadResult.path,
            id,
        ]);

        return res.status(200).json({
            mensagem: "Imagem atualizada com sucesso.",
            produto: updatedRows[0],
            url: uploadResult.url,
        });
    } catch (error) {
        console.error("Erro ao atualizar imagem do produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = {
    cadastrarProduto,
    editarProduto,
    listarProdutos,
    detalharProduto,
    excluirProduto,
    atualizarImagemProduto
};
