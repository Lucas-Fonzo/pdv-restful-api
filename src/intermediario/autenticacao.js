
const jwt = require('jsonwebtoken');
const config = require('../configs');

const autenticacao = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    const [, token] = authorization.split(' ');

    try {
        const payload = jwt.verify(token, config.jwtSecret);
        req.usuarioId = payload.id;

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido." });
    }
};

module.exports = autenticacao;
