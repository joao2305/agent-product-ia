require("dotenv").config();

const { tavily } = require("@tavily/core");

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

async function pesquisarInformacoes(consulta) {

    const resultado = await client.search(consulta, {
        maxResults: 5,
        searchDepth: "basic"
    });

    return resultado.results.map(item => ({
        titulo: item.title,
        conteudo: item.content,
        url: item.url
    }));
}

module.exports = { pesquisarInformacoes };