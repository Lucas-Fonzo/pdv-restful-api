const { pool } = require('../conexao');


const listarCategorias = async (req, res) => {
    try {
        const query = 'SELECT * FROM categorias';
        const { rows } = await pool.query(query);

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = {
    listarCategorias,
};