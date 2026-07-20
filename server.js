const express = require("express");
const conexao = require("./conexao");

const app = express();

app.use(express.json());

app.get("/", function(req, res) {
  res.send("API da Estante Virtual funcionando!");
});

app.get("/livros", function(req, res) {

    conexao.query("SELECT * FROM livros", function(err, results) {

        if (err) {
            return res.status(500).json({
                mensagem: "Erro ao buscar livros."
            });
        }

        res.json(results);

    });

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

    let { titulo, autor, preco, quantidade } = req.body;

    conexao.query(
        "INSERT INTO livros (titulo, autor, preco, quantidade) VALUES (?, ?, ?, ?)",
        [titulo, autor, preco, quantidade],
        function(err, results) {

            if (err) {
                return res.status(500).json({
                    mensagem: "Erro ao cadastrar livro."
                });
            }

            res.json({
                mensagem: "Livro cadastrado com sucesso!"
            });

        }
    );

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