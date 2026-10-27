
const express = require("express");
const router = express.Router();

const { sql, conectarBanco } = require("../config/database");

// GET: listar produtos
router.get("/", async (req, res) => {
    try {
        const pool = await conectarBanco();

        const resultado = await pool.request().query(`
            SELECT IdProduto, Nome, CodigoProduto, Preco,
                   Quantidade, Categoria, Ativo
            FROM Produtos
            ORDER BY IdProduto
        `);

        return res.status(200).json(resultado.recordset);
    } catch (erro) {
        console.error("Erro ao consultar produtos:", erro);
        return res.status(500).json({
            mensagem: "Erro ao consultar os produtos."
        });
    }
});

// POST: cadastrar produto
router.post("/", async (req, res) => {
    try {
        const {
            Nome,
            CodigoProduto,
            Preco,
            Quantidade,
            Categoria,
            Ativo
        } = req.body;

        if (
            typeof Nome !== "string" || !Nome.trim() ||
            typeof CodigoProduto !== "string" || !CodigoProduto.trim() ||
            Preco === undefined ||
            Quantidade === undefined
        ) {
            return res.status(400).json({
                mensagem: "Informe Nome, CodigoProduto, Preco e Quantidade."
            });
        }

        if (
            !Number.isFinite(Number(Preco)) ||
            Number(Preco) <= 0 ||
            !Number.isInteger(Number(Quantidade)) ||
            Number(Quantidade) < 0
        ) {
            return res.status(400).json({
                mensagem: "Preço deve ser positivo e quantidade deve ser um inteiro não negativo."
            });
        }

        if (Ativo !== undefined && typeof Ativo !== "boolean") {
            return res.status(400).json({
                mensagem: "Ativo deve ser true ou false."
            });
        }

        const pool = await conectarBanco();

        const resultado = await pool.request()
            .input("Nome", sql.VarChar(100), Nome.trim())
            .input("CodigoProduto", sql.VarChar(50), CodigoProduto.trim())
            .input("Preco", sql.Decimal(10, 2), Number(Preco))
            .input("Quantidade", sql.Int, Number(Quantidade))
            .input("Categoria", sql.VarChar(100), Categoria || null)
            .input("Ativo", sql.Bit, Ativo === undefined ? true : Ativo)
            .query(`
                INSERT INTO Produtos
                    (Nome, CodigoProduto, Preco, Quantidade, Categoria, Ativo)
                OUTPUT INSERTED.IdProduto, INSERTED.Nome,
                       INSERTED.CodigoProduto, INSERTED.Preco,
                       INSERTED.Quantidade, INSERTED.Categoria,
                       INSERTED.Ativo
                VALUES
                    (@Nome, @CodigoProduto, @Preco, @Quantidade,
                     @Categoria, @Ativo);
            `);

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            produto: resultado.recordset[0]
        });
    } catch (erro) {
        console.error("Erro ao cadastrar produto:", erro);
        return res.status(500).json({
            mensagem: "Erro ao cadastrar o produto."
        });
    }
});


 // PUT: alterar produto pelo código
router.put("/:codigoProduto", async (req, res) => {
    try {
        const codigo = req.params.codigoProduto;
        const { Nome, Preco, Quantidade } = req.body;

        const pool = await conectarBanco();

        const resultado = await pool.request()
            .input("CodigoProduto", sql.VarChar(50), codigo)
            .input("Nome", sql.VarChar(100), Nome.trim())
            .input("Preco", sql.Decimal(10, 2), Number(Preco))
            .input("Quantidade", sql.Int, Number(Quantidade))
            .query(`
                UPDATE Produtos
                SET Nome = @Nome,
                    Preco = @Preco,
                    Quantidade = @Quantidade
                OUTPUT INSERTED.IdProduto,
                       INSERTED.Nome,
                       INSERTED.CodigoProduto,
                       INSERTED.Preco,
                       INSERTED.Quantidade,
                       INSERTED.Ativo
                WHERE CodigoProduto = @CodigoProduto
                  AND Ativo = 1;
            `);

        if (resultado.recordset.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado ou inativo."
            });
        }

        return res.status(200).json({
            mensagem: "Produto alterado com sucesso!",
            produto: resultado.recordset[0]
        });
    } catch (erro) {
        console.error("Erro ao alterar produto:", erro);
        return res.status(500).json({
            mensagem: "Erro ao alterar o produto."
        });
    }
});


 // DELETE: desativar produto pelo código
router.delete("/:codigoProduto", async (req, res) => {
    try {
        const codigo = req.params.codigoProduto;
        const pool = await conectarBanco();

        const resultado = await pool.request()
            .input("CodigoProduto", sql.VarChar(50), codigo)
            .query(`
                UPDATE Produtos
                SET Ativo = 0
                OUTPUT INSERTED.IdProduto,
                       INSERTED.Nome,
                       INSERTED.CodigoProduto,
                       INSERTED.Ativo
                WHERE CodigoProduto = @CodigoProduto
                  AND Ativo = 1;
            `);

        if (resultado.recordset.length === 0) {
            return res.status(404).json({
                mensagem: "Produto não encontrado ou já está inativo."
            });
        }

        return res.status(200).json({
            mensagem: "Produto excluído do estoque com sucesso!",
            produto: resultado.recordset[0]
        });
    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        return res.status(500).json({
            mensagem: "Erro ao excluir o produto."
        });
    }
});


module.exports = router;
