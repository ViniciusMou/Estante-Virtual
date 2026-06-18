const express = require("express");
const funcoes = require("./funcoes/livrosFuncoes");

const app = express();

app.use(express.json());

app.get("/", function(req, res) {
  res.send("API da Estante Virtual funcionando!");
});

app.get("/livros", function(req, res) {
  let livros = funcoes.listarLivros();
  res.json(livros);
});

app.get("/livros/:id", function(req, res) {
  let id = Number(req.params.id);

  let livro = funcoes.buscarLivroPorId(id);

  if (!livro) {
    return res.status(404).json({
      mensagem: "Livro não encontrado."
    });
  }

  res.json(livro);
});

app.post("/livros", function(req, res) {
  let { nome, autor, preco, estoque } = req.body;

  let mensagem = funcoes.cadastrarLivro(
    nome,
    autor,
    preco,
    estoque
  );

  res.json({
    mensagem: mensagem
  });
});

app.put("/livros/:id", function(req, res) {
  let id = Number(req.params.id);
  let { nome, autor, preco, estoque } = req.body;

  let livro = funcoes.editarLivro(
    id,
    nome,
    autor,
    Number(preco),
    Number(estoque)
  );

  res.json({
    mensagem: livro
  });
});
app.delete("/livros/:id", function(req, res) {

  let id = Number(req.params.id);

  let mensagem = funcoes.removerLivro(id);

  res.json({
    mensagem: mensagem
  });

});
app.listen(3000, function() {
  console.log("Servidor rodando na porta 3000");
});