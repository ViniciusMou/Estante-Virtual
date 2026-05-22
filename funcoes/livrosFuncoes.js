const livros = require("../dados/livros");
const fs = require("fs");

function salvarLivros() {
  fs.writeFileSync(
    "./dados/livros.json",
    JSON.stringify(livros, null, 2)
  );
}

function listarLivros() {

  if (livros.length === 0) {
    return "Nenhum livro cadastrado.";
  }

  livros.forEach(livro => {

    console.log(`
========================
ID: ${livro.id}
Nome: ${livro.nome}
Autor: ${livro.autor}
Preço: R$ ${livro.preco}
Estoque: ${livro.estoque}
Disponível: ${livro.disponivel ? "Sim" : "Não"}
========================
`);
  });

}

function cadastrarLivro(nome, autor, preco, estoque) {

  if (!nome || !autor) {
    return "Nome e autor são obrigatórios.";
  }

  if (preco < 0 || estoque < 0) {
    return "Preço e estoque não podem ser negativos.";
  }

  const novoId = livros.length > 0
    ? livros[livros.length - 1].id + 1
    : 1;

  const novoLivro = {
    id: novoId,
    nome,
    autor,
    preco,
    estoque,
    disponivel: estoque > 0
  };

  livros.push(novoLivro);

  salvarLivros();

  return "Livro cadastrado com sucesso.";
}

function buscarLivro(nome) {

  let livrosEncontrados = livros.filter(
    l => l.nome.toLowerCase().includes(nome.toLowerCase())
  );

  if (livrosEncontrados.length === 0) {
    return "Livro não encontrado.";
  }

  livrosEncontrados.forEach(livro => {

    console.log(`
========================
ID: ${livro.id}
Nome: ${livro.nome}
Autor: ${livro.autor}
Preço: R$ ${livro.preco}
Estoque: ${livro.estoque}
Disponível: ${livro.disponivel ? "Sim" : "Não"}
========================
`);

  });

}


function removerLivro(id) {

  let indiceLivro = livros.findIndex(
    l => l.id === id
  );

  if (indiceLivro === -1) {
    return "Livro não encontrado.";
  }

  livros.splice(indiceLivro, 1);

  salvarLivros();

  return "Livro removido com sucesso.";
}

function editarLivro(id, novoNome, novoAutor, novoPreco, novoEstoque) {

  let livro = livros.find(
    l => l.id === id
  );

  if (!livro) {
    return "Livro não encontrado.";
  }

  livro.nome = novoNome;
  livro.autor = novoAutor;
  livro.preco = novoPreco;
  livro.estoque = novoEstoque;
  livro.disponivel = novoEstoque > 0;

  salvarLivros();

  return "Livro atualizado com sucesso.";
}

function venderLivro(id) {

  let livro = livros.find(
    l => l.id === id
  );

  if (!livro) {
    return "Livro não encontrado.";
  }

  if (livro.estoque <= 0) {
    return "Livro sem estoque.";
  }

  livro.estoque--;

  if (livro.estoque === 0) {
    livro.disponivel = false;
  }

  salvarLivros();

  return "Venda realizada com sucesso.";
}

module.exports = {
  listarLivros,
  cadastrarLivro,
  buscarLivro,
  removerLivro,
  editarLivro,
  venderLivro
};