const { knex } = require("../conexao");

const cadastrarCliente = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  if (!nome || !email || !cpf) {
    return res.status(400).json({ mensagem: "Nome, email e CPF são obrigatórios." });
  }

  try {
    const emailExiste = await knex("clientes").where({ email }).first();

    if (emailExiste) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const cpfExiste = await knex("clientes").where({ cpf }).first();

    if (cpfExiste) {
      return res.status(400).json({ mensagem: "CPF já cadastrado." });
    }

    const [id] = await knex("clientes")
      .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
      .returning("id");

    return res.status(201).json({ id, mensagem: "Cliente cadastrado com sucesso." });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};


const atualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

  if (!nome || !email || !cpf) {
    return res.status(400).json({ mensagem: "Nome, email e CPF são obrigatórios." });
  }

  try {
    const clienteExistente = await knex("clientes").where({ id }).first();

    if (!clienteExistente) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    const emailCadastrado = await knex("clientes")
      .where({ email })
      .andWhereNot({ id })
      .first();
    const cpfCadastrado = await knex("clientes")
      .where({ cpf })
      .andWhereNot({ id })
      .first();

    if (emailCadastrado) {
      return res.status(400).json({ mensagem: "Este email já está cadastrado." });
    }

    if (cpfCadastrado) {
      return res.status(400).json({ mensagem: "Este CPF já está cadastrado." });
    }

    await knex("clientes").where({ id }).update({
      nome,
      email,
      cpf,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    });

    return res.status(200).json({ mensagem: "Cliente atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao atualizar cliente." });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await knex("clientes").select();

    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao listar clientes." });
  }
};

const obterClienteEspecifico = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await knex("clientes").where({ id }).first();

    if (!cliente) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }
    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao obter cliente." });
  }
};

module.exports = {
  cadastrarCliente,
  atualizarCliente,
  listarClientes,
  obterClienteEspecifico,
};
