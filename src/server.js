const { perguntarIA } = require("./services/aiServices");
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        mensagem: "Agent Products AI está funcionando!"
    });
});

app.post("/chat", async (req, res) => {

    try {

        const { pergunta } = req.body;

        if (!pergunta) {
            return res.status(400).json({
                erro: "Informe uma pergunta."
            });
        }

        const resposta = await perguntarIA(pergunta);

        res.json({
            pergunta,
            resposta
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao consultar a IA."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});