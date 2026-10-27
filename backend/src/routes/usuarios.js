const express = require("express");
const router = express.Router();

const { sql, conectarBanco } = require("../config/database");

// CADASTRAR USUÁRIO
router.post("/", async (req, res) => {
    try {
        const { Nome, Email, Senha } = req.body;

        if (!Nome || !Email || !Senha) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        const pool = await conectarBanco();

        const usuarioExistente = await pool.request()
            .input("Email", sql.VarChar(150), Email)
            .query(`
                SELECT IdUsuario
                FROM Usuarios
                WHERE Email = @Email;
            `);

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({
                mensagem: "Este email já está cadastrado."
            });
        }

        await pool.request()
            .input("Nome", sql.VarChar(100), Nome)
            .input("Email", sql.VarChar(150), Email)
            .input("Senha", sql.VarChar(255), Senha)
            .query(`
                INSERT INTO Usuarios (Nome, Email, Senha)
                VALUES (@Nome, @Email, @Senha);
            `);

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário."
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { Email, Senha } = req.body;

        if (!Email || !Senha) {
            return res.status(400).json({
                mensagem: "Preencha email e senha."
            });
        }

        const pool = await conectarBanco();

        const resultado = await pool.request()
            .input("Email", sql.VarChar(150), Email)
            .input("Senha", sql.VarChar(255), Senha)
            .query(`
                SELECT
                    IdUsuario,
                    Nome,
                    Email
                FROM Usuarios
                WHERE Email = @Email
                  AND Senha = @Senha;
            `);

        if (resultado.recordset.length === 0) {
            return res.status(401).json({
                mensagem: "Email ou senha incorretos."
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario: resultado.recordset[0]
        });

    } catch (erro) {
        console.error("Erro ao realizar login:", erro);

        return res.status(500).json({
            mensagem: "Erro ao realizar login."
        });
    }
});

module.exports = router;