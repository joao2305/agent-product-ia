const produtos = [
    {
        id: 1,
        nome: "Mouse Logitech",
        preco: 85.90,
        categoria: "Periféricos"
    },
    {
        id: 2,
        nome: "Teclado Mecânico",
        preco: 250.00,
        categoria: "Periféricos"
    },
    {
        id: 3,
        nome: "Mousepad",
        preco: 45.50,
        categoria: "Acessórios"
    },
    {
        id: 4,
        nome: "Webcam",
        preco: 99.90,
        categoria: "Periféricos"
    },
    {
        id: 5,
        nome: "Monitor",
        preco: 899.90,
        categoria: "Monitores"
    }
];

function buscarProdutos(precoMaximo) {

    return produtos.filter(produto => {
        return produto.preco <= precoMaximo;
    });

}

function buscarProdutoPorNome(nome) {

    return produtos.filter(produto => {
        return produto.nome.toLowerCase().includes(nome.toLowerCase());
    });

}

module.exports = {
    buscarProdutos,
    buscarProdutoPorNome
};

console.log(buscarProdutos(100));

console.log(buscarProdutoPorNome("mouse"));