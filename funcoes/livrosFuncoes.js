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

module.exports = {
  listarLivros,
  cadastrarLivro,
  buscarLivro,
  removerLivro,
  editarLivro
};
function cadastrarLivro(nome, autor) {
  const novoLivro = {
    id: livros.length + 1,
    nome: nome,
    autor: autor,
    disponivel: true
  };

  livros.push(novoLivro);

  salvarLivros();

  return "Livro cadastrado com sucesso";
}
function buscarLivro(nome){

    let livro = livros.find(l => l.nome === nome);

    if (!livro) {
        return "Livro não encontrado";
    }

    return livro;
}

function removerLivro(id) {
  let indiceLivro = livros.findIndex(l => l.id === id);

  if (indiceLivro === -1) {
    return "Livro não encontrado";
  }

  livros.splice(indiceLivro, 1);

salvarLivros();

  return "Livro removido com sucesso";
}
function editarLivro(nomeAtual, novoNome){
    let livro = livros.find(l => l.nome === nomeAtual)
    if (!livro){
        return "Livro não cadastrado."
    }
    livro.nome = novoNome; 

    salvarLivros();

    return "Livro atualizado com sucesso"
}