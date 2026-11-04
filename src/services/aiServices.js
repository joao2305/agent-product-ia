require("dotenv").config();

const Groq = require("groq-sdk");

const {
    buscarProdutos,
    buscarProdutoPorNome,
    buscarProdutosPorCategoria
} = require("../tools/productTools");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
const {
    pesquisarInformacoes
} = require("../tools/searchTools");
// Ferramentas disponíveis para o modelo
const tools = [
    {
        type: "function",
        function: {
            name: "buscarProdutos",
            description: "Busca produtos por preço máximo.",
            parameters: {
                type: "object",
                properties: {
                    precoMaximo: {
                        type: "number"
                    }
                },
                required: ["precoMaximo"]
            }
        }
    },
    {
    type: "function",
        function: {
            name: "pesquisarInformacoes",
            description: "Pesquisa informações externas na internet sobre produtos, tecnologias e outros assuntos.",
            parameters: {
                type: "object",
                properties: {
                    consulta: {
                        type: "string",
                        description: "Assunto que deve ser pesquisado."
                    }
                },
                required: ["consulta"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "buscarProdutoPorNome",
            description: "Busca produtos pelo nome.",
            parameters: {
                type: "object",
                properties: {
                    nome: {
                        type: "string"
                    }
                },
                required: ["nome"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "buscarProdutosPorCategoria",
            description: "Busca produtos por categoria.",
            parameters: {
                type: "object",
                properties: {
                    categoria: {
                        type: "string"
                    }
                },
                required: ["categoria"]
            }
        }
    }
];


function executarFerramenta(nome, argumentos) {

    switch (nome) {

        case "buscarProdutos":
            return buscarProdutos(argumentos.precoMaximo);

        case "buscarProdutoPorNome":
            return buscarProdutoPorNome(argumentos.nome);

        case "buscarProdutosPorCategoria":
            return buscarProdutosPorCategoria(argumentos.categoria);
        case "pesquisarInformacoes":
            return pesquisarInformacoes(argumentos.consulta);

        default:
            throw new Error("Ferramenta não permitida.");
    }
}


async function perguntarIA(pergunta) {
  const messages = [
    {
      role: "system",
      content: `
        Você é um assistente especializado em produtos.
        Use as ferramentas disponíveis para pesquisar informações
        quando necessário.
        Depois de obter informações suficientes, responda ao usuário
        de forma clara e objetiva.
      `
    },
    {
      role: "user",
      content: pergunta
    }
  ];

  const MAX_ITERACOES = 5;

  for (let i = 0; i < MAX_ITERACOES; i++) {
    const resposta = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      tools,
      tool_choice: "auto"
    });

    const mensagem = resposta.choices[0].message;

    // Adiciona a resposta do modelo ao histórico
    messages.push(mensagem);

    // Se não houver chamada de ferramenta, retorna a resposta
    if (!mensagem.tool_calls || mensagem.tool_calls.length === 0) {
      return mensagem.content;
    }

    // Executa as ferramentas solicitadas pelo modelo
    for (const chamada of mensagem.tool_calls) {
      const nome = chamada.function.name;
      const argumentos = JSON.parse(
        chamada.function.arguments || "{}"
      );

      let resultado;

      try {
        resultado = await executarFerramenta(nome, argumentos);
      } catch (erro) {
        resultado = { erro: erro.message };
      }

      messages.push({
        role: "tool",
        tool_call_id: chamada.id,
        content: JSON.stringify(resultado)
      });
    }
  }

  throw new Error("O agente excedeu o limite de chamadas de ferramentas.");
}

module.exports = { perguntarIA };
