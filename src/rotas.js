const express = require("express");
const multer = require("multer");
const path = require("path");
const autenticacao = require("./intermediario/autenticacao");
const controladorUsuario = require("./controladores/controladorUsuario");
const controladorCategoria = require("./controladores/controladorCategoria");
const controladorProduto = require("./controladores/controladorProduto");
const controladorCliente = require("./controladores/controladorCliente");
const controladorPedido = require('./controladores/controladorPedido');

const rotas = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

rotas.post("/login", controladorUsuario.login);
rotas.post("/usuario", controladorUsuario.cadastrarUsuario);
rotas.post("/produto", controladorProduto.cadastrarProduto);

rotas.use(autenticacao);

rotas.post("/cliente", controladorCliente.cadastrarCliente);
rotas.post('/pedido', autenticacao, controladorPedido.cadastrarPedido);
rotas.patch("/usuario/redefinir", controladorUsuario.redefinirSenha);
rotas.get("/categoria", controladorCategoria.listarCategorias);
rotas.get("/usuario", controladorUsuario.detalharUsuario);
rotas.get("/produto", controladorProduto.listarProdutos);
rotas.get("/produto/:id", controladorProduto.detalharProduto);
rotas.get('/pedido', autenticacao, controladorPedido.listarPedidos);
rotas.get("/cliente", controladorCliente.listarClientes);
rotas.get("/cliente/:id", controladorCliente.obterClienteEspecifico);

rotas.put("/usuario", controladorUsuario.editarUsuario);
rotas.put("/produto/:id", controladorProduto.editarProduto);
rotas.put("/cliente/:id", controladorCliente.atualizarCliente);

rotas.delete("/produto/:id", controladorProduto.excluirProduto);

rotas.patch(
    "/produto/:id/imagem",
    upload.single("imagem"),
    controladorProduto.atualizarImagemProduto
);

module.exports = rotas;
