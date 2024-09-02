const { pool, knex } = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configs");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rowCount } = await pool.query(query, [email]);

    if (rowCount > 0) {
      return res.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const insertQuery =
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(insertQuery, [
      nome,
      email,
      senhaCriptografada,
    ]);

    const usuario = result.rows[0];

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};


const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows, rowCount } = await pool.query(query, [email]);

    if (rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = jwt.sign({ id: usuario.id }, config.jwtSecret, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const redefinirSenha = async (req, res) => {
  const { email, senhaAntiga, senhaNova } = req.body;

  if (!email || !senhaAntiga || !senhaNova) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(404).json("Usuário não encontrado.");
    }

    const senhaValida = await bcrypt.compare(senhaAntiga, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json("Senha antiga está incorreta.");
    }

    const senhaNovaHash = await bcrypt.hash(senhaNova, 10);
    await knex("usuarios").where({ email }).update({ senha: senhaNovaHash });

    return res.status(200).json("Senha atualizada com sucesso.");
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const detalharUsuario = async (req, res) => {
  const { usuarioId } = req;

  try {
    const query = 'SELECT id, nome, email FROM usuarios WHERE id = $1';
    const { rows, rowCount } = await pool.query(query, [usuarioId]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

const editarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { usuarioId } = req;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
  }

  try {
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND id != $2",
      [email, usuarioId]
    );

    if (usuarioExistente.rowCount > 0) {
      return res.status(400).json({ mensagem: "Email já cadastrado por outro usuário." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
      UPDATE usuarios 
      SET nome = $1, email = $2, senha = $3 
      WHERE id = $4 
      RETURNING id, nome, email
    `;
    const { rows } = await pool.query(query, [nome, email, senhaCriptografada, usuarioId]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};



module.exports = {
  cadastrarUsuario,
  login,
  redefinirSenha,
  detalharUsuario,
  editarUsuario
};
