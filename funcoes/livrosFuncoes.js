const livros = require("../dados/livros");
const fs = require("fs");

function salvarLivros() {
  fs.writeFileSync(
    "./dados/livros.json",
    JSON.stringify(livros, null, 2)
  );
}

function listarLivros() {

  return livros;
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

  return livrosEncontrados;
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

if (!novoNome || !novoAutor) {
  return "Nome e autor são obrigatórios.";
}

if (novoPreco < 0 || novoEstoque < 0) {
  return "Preço e estoque não podem ser negativos.";
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

function estatisticasLivros() {

  let totalLivros = livros.length;

  let livrosDisponiveis = livros.filter(
    livro => livro.disponivel
  ).length;

  let livrosSemEstoque = livros.filter(
    livro => livro.estoque === 0
  ).length;

  let valorTotalEstoque = livros.reduce(
    (total, livro) => total + (livro.preco * livro.estoque),
    0
  );

  return {
    totalLivros,
    livrosDisponiveis,
    livrosSemEstoque,
    valorTotalEstoque
  };
}

module.exports = {
  listarLivros,
  cadastrarLivro,
  buscarLivro,
  removerLivro,
  editarLivro,
  venderLivro,
  estatisticasLivros
};