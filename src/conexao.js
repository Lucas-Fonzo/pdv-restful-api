const { Pool } = require("pg");
const config = require("./configs");

const knex = require("knex")({
  client: "pg",
  connection: {
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
  },
});

const pool = new Pool({
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
});

module.exports = { pool, knex };
