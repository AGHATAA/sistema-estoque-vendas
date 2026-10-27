
const express = require("express");
const router = express.Router();

const { sql, conectarBanco } = require("../config/database");

// ==========================================
// TESTE DA ROTA
// ==========================================

router.get("/", (req, res) => {
    res.json({
        mensagem: "Rota vendas funcionando!"
    });
});


// ==========================================
// GET: BUSCAR PRODUTO PELO CÓDIGO
// ==========================================

router.get("/produto/:codigoProduto", async (req, res) => {

    try {

        const codigo = req.params.codigoProduto;

        const pool = await conectarBanco();

        const resultado = await pool.request()

            .input(
                "CodigoProduto",
                sql.VarChar(50),
                codigo
            )

            .query(`
                SELECT
                    IdProduto,
                    Nome,
                    CodigoProduto,
                    Preco,
                    Quantidade,
                    Categoria
                FROM Produtos
                WHERE CodigoProduto = @CodigoProduto
                  AND Ativo = 1;
            `);


        if (resultado.recordset.length === 0) {

            return res.status(404).json({

                mensagem:
                    "Produto não encontrado ou está inativo."

            });

        }


        return res.status(200).json(
            resultado.recordset[0]
        );


    } catch (erro) {

        console.error(
            "Erro ao buscar produto:",
            erro
        );

        return res.status(500).json({

            mensagem:
                "Erro ao buscar o produto."

        });

    }

});


// ==========================================
// POST: FINALIZAR VENDA
// ==========================================

router.post("/", async (req, res) => {

    const { IdUsuario, produtos } = req.body;


    // ==========================================
    // VALIDAR DADOS
    // ==========================================

    if (
        !IdUsuario ||
        !Array.isArray(produtos) ||
        produtos.length === 0
    ) {

        return res.status(400).json({

            mensagem:
                "Usuário e produtos da venda são obrigatórios."

        });

    }


    try {

        const pool = await conectarBanco();


        // ==========================================
        // INICIAR TRANSAÇÃO
        // ==========================================

        const transaction =
            new sql.Transaction(pool);

        await transaction.begin();


        try {

            let valorTotal = 0;


            // ==========================================
            // VERIFICAR PRODUTOS
            // ==========================================

            for (const item of produtos) {

                const resultado =
                    await new sql.Request(transaction)

                        .input(
                            "IdProduto",
                            sql.Int,
                            item.IdProduto
                        )

                        .query(`
                            SELECT
                                IdProduto,
                                Nome,
                                Preco,
                                Quantidade,
                                Ativo
                            FROM Produtos
                            WHERE IdProduto = @IdProduto;
                        `);


                // Produto não encontrado

                if (
                    resultado.recordset.length === 0
                ) {

                    throw new Error(
                        "Produto não encontrado."
                    );

                }


                const produto =
                    resultado.recordset[0];


                // Produto inativo

                if (!produto.Ativo) {

                    throw new Error(
                        `O produto ${produto.Nome} está inativo.`
                    );

                }


                // Quantidade inválida

                if (
                    !Number.isInteger(
                        Number(item.Quantidade)
                    ) ||
                    Number(item.Quantidade) <= 0
                ) {

                    throw new Error(
                        `Quantidade inválida para ${produto.Nome}.`
                    );

                }


                // Estoque insuficiente

                if (
                    Number(item.Quantidade) >
                    Number(produto.Quantidade)
                ) {

                    throw new Error(
                        `Estoque insuficiente para ${produto.Nome}.`
                    );

                }


                // Calcular total

                valorTotal +=
                    Number(produto.Preco) *
                    Number(item.Quantidade);

            }


            // ==========================================
            // CRIAR VENDA
            // ==========================================

            const venda =
                await new sql.Request(transaction)

                    .input(
                        "IdUsuario",
                        sql.Int,
                        IdUsuario
                    )

                    .input(
                        "ValorTotal",
                        sql.Decimal(10, 2),
                        valorTotal
                    )

                    .query(`
                        INSERT INTO Vendas
                        (
                            IdUsuario,
                            ValorTotal
                        )

                        OUTPUT INSERTED.IdVenda

                        VALUES
                        (
                            @IdUsuario,
                            @ValorTotal
                        );
                    `);


            const IdVenda =
                venda.recordset[0].IdVenda;


            // ==========================================
            // INSERIR ITENS DA VENDA
            // ==========================================

            for (const item of produtos) {

                const resultado =
                    await new sql.Request(transaction)

                        .input(
                            "IdProduto",
                            sql.Int,
                            item.IdProduto
                        )

                        .query(`
                            SELECT Preco
                            FROM Produtos
                            WHERE IdProduto = @IdProduto;
                        `);


                const preco =
                    resultado.recordset[0].Preco;


                await new sql.Request(transaction)

                    .input(
                        "IdVenda",
                        sql.Int,
                        IdVenda
                    )

                    .input(
                        "IdProduto",
                        sql.Int,
                        item.IdProduto
                    )

                    .input(
                        "Quantidade",
                        sql.Int,
                        item.Quantidade
                    )

                    .input(
                        "PrecoUnitario",
                        sql.Decimal(10, 2),
                        preco
                    )

                    .query(`
                        INSERT INTO ItensVenda
                        (
                            IdVenda,
                            IdProduto,
                            Quantidade,
                            PrecoUnitario
                        )

                        VALUES
                        (
                            @IdVenda,
                            @IdProduto,
                            @Quantidade,
                            @PrecoUnitario
                        );
                    `);


                // ==========================================
                // ATUALIZAR ESTOQUE
                // ==========================================

                await new sql.Request(transaction)

                    .input(
                        "IdProduto",
                        sql.Int,
                        item.IdProduto
                    )

                    .input(
                        "Quantidade",
                        sql.Int,
                        item.Quantidade
                    )

                    .query(`
                        UPDATE Produtos

                        SET Quantidade =
                            Quantidade - @Quantidade

                        WHERE IdProduto = @IdProduto;
                    `);

            }


            // ==========================================
            // CONFIRMAR TRANSAÇÃO
            // ==========================================

            await transaction.commit();


            return res.status(201).json({

                mensagem:
                    "Venda realizada com sucesso!",

                IdVenda:
                    IdVenda,

                ValorTotal:
                    valorTotal

            });


        } catch (erro) {

            // ==========================================
            // DESFAZER VENDA SE DER ERRO
            // ==========================================

            await transaction.rollback();

            throw erro;

        }


    } catch (erro) {

        console.error(
            "Erro ao finalizar venda:",
            erro
        );


        return res.status(500).json({

            mensagem:
                erro.message ||
                "Erro ao finalizar a venda."

        });

    }

});


module.exports = router;
