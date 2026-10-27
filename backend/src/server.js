
const express = require("express");
const cors = require("cors");

const { conectarBanco } = require("./config/database");
const produtosRoutes = require("./routes/produtos");
const vendasRoutes = require("./routes/vendas");
const usuariosRoutes = require("./routes/usuarios");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Sistema de Estoque e Vendas funcionando!"
    });
});

app.use("/produtos", produtosRoutes);
app.use("/vendas", vendasRoutes);

const PORT = 3000;

const iniciarServidor = async () => {
    try {
        await conectarBanco();
        console.log("SQL Server conectado!");

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
        });
    } catch (erro) {
        console.error("Erro ao iniciar o servidor:", erro);
    }
};

iniciarServidor();
