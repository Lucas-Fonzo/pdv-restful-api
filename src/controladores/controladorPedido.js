const pool = require('../conexao');
const autenticacao = require('../intermediario/autenticacao');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    if (!cliente_id || !pedido_produtos || pedido_produtos.length === 0) {
        return res.status(400).json({ mensagem: "Os campos cliente_id e pedido_produtos são obrigatórios, e pedido_produtos deve conter ao menos um produto." });
    }

    try {
        const queryCliente = 'SELECT * FROM clientes WHERE id = $1';
        const { rowCount: clienteExiste } = await pool.query(queryCliente, [cliente_id]);

        if (!clienteExiste) {
            return res.status(400).json({ mensagem: "Cliente informado não existe." });
        }

        let valorTotal = 0;

        for (const item of pedido_produtos) {
            const queryProduto = 'SELECT * FROM produtos WHERE id = $1';
            const { rows, rowCount: produtoExiste } = await pool.query(queryProduto, [item.produto_id]);

            if (!produtoExiste) {
                return res.status(400).json({ mensagem: `Produto com id ${item.produto_id} não existe.` });
            }

            const produto = rows[0];

            if (produto.quantidade_estoque < item.quantidade_produto) {
                return res.status(400).json({ mensagem: `Quantidade insuficiente em estoque para o produto ${produto.descricao}.` });
            }

            valorTotal += produto.valor * item.quantidade_produto;
        }

        const queryAddPedido = `
            INSERT INTO pedidos (cliente_id, observacao, valor_total)
            VALUES ($1, $2, $3) RETURNING *
        `;
        const { rows: pedidoRows } = await pool.query(queryAddPedido, [cliente_id, observacao, valorTotal]);

        const pedido = pedidoRows[0];

        for (const item of pedido_produtos) {
            const queryAddPedidoProduto = `
                INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade_produto, valor_produto)
                VALUES ($1, $2, $3, $4)
            `;
            await pool.query(queryAddPedidoProduto, [pedido.id, item.produto_id, item.quantidade_produto, item.valor_produto]);

            const queryAtualizarEstoque = `
                UPDATE produtos
                SET quantidade_estoque = quantidade_estoque - $1
                WHERE id = $2
            `;
            await pool.query(queryAtualizarEstoque, [item.quantidade_produto, item.produto_id]);
        }

        return res.status(201).json(pedido);
    } catch (error) {
        console.error("Erro ao cadastrar pedido:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let queryPedidos;
        let params = [];

        if (cliente_id) {
            queryPedidos = 'SELECT * FROM pedidos WHERE cliente_id = $1';
            params.push(cliente_id);
        } else {
            queryPedidos = 'SELECT * FROM pedidos';
        }

        const { rows: pedidos } = await pool.query(queryPedidos, params);

        for (const pedido of pedidos) {
            const queryProdutos = 'SELECT * FROM pedido_produtos WHERE pedido_id = $1';
            const { rows: produtos } = await pool.query(queryProdutos, [pedido.id]);
            pedido.produtos = produtos;
        }

        return res.json(pedidos);
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const excluirProdutoPedido = async (req, res) => {
    const { id } = req.params;

    try {
        const queryProdutoVinculado = 'SELECT * FROM pedido_produtos WHERE produto_id = $1';
        const { rowCount: produtoVinculado } = await pool.query(queryProdutoVinculado, [id]);

        if (produtoVinculado > 0) {
            return res.status(400).json({ mensagem: "Produto vinculado a um pedido não pode ser excluído." });
        }


        const queryexcluirProdutoPedido = 'DELETE FROM produtos WHERE id = $1';
        await pool.query(queryexcluirProdutoPedido, [id]);

        return res.status(200).json({ mensagem: "Produto excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

module.exports = {
    cadastrarPedido,
    listarPedidos,
    excluirProdutoPedido,
};
