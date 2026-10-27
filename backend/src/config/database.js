const sql = require("mssql");
require("dotenv").config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const conectarBanco = async () => {
    try {
        const pool = await sql.connect(config);

        console.log("SQL Server conectado!");

        return pool;
    } catch (erro) {
        console.error("Erro ao conectar ao SQL Server:", erro);
        throw erro;
    }
};

module.exports = {
    sql,
    conectarBanco
};
