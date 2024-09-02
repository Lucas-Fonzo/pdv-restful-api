
const express = require('express');
const config = require('./configs');
const rotas = require('./rotas');

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(config.serverPort, () => {
    console.log(`Servidor rodando na porta ${config.serverPort}`);
});
module.exports = app;