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

    const id = req.params.id;

    conexao.query(
        "SELECT * FROM livros WHERE id = ?",
        [id],
        function(err, results) {

            if (err) {
                return res.status(500).json({
                    mensagem: "Erro ao buscar livro."
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    mensagem: "Livro não encontrado."
                });
            }

            res.json(results[0]);

        }
    );

});

app.post("/livros", function(req, res) {
    
  

    const { titulo, autor, preco, quantidade } = req.body;
    
if (typeof titulo !== "string" || !titulo.trim()) {
    return res.status(400).json({
        mensagem: "O título é obrigatório."
    });
}

if (typeof autor !== "string" || !autor.trim()) {
    return res.status(400).json({
        mensagem: "O autor é obrigatório."
    });
}
if (preco === undefined || preco === "") {
    return res.status(400).json({
        mensagem: "O preço é obrigatório."
    });
}

if (!Number.isFinite(preco)) {
    return res.status(400).json({
        mensagem: "O preço deve ser um número válido."
    });
}
if (preco <= 0) {
    return res.status(400).json({
        mensagem: "O preço deve ser maior que zero."
    });
}
if (quantidade === undefined || quantidade === "") {
    return res.status(400).json({
        mensagem: "A quantidade é obrigatória."
    });
}
if (!Number.isFinite(quantidade)) {
    return res.status(400).json({
        mensagem: "A quantidade deve ser um número válido."
    });
}
if (!Number.isInteger(quantidade)) {
    return res.status(400).json({
        mensagem: "A quantidade deve ser um número inteiro."
    });
}
if (quantidade < 0) {
    return res.status(400).json({
        mensagem: "A quantidade não pode ser negativa."
    });
}
    conexao.query(
        "INSERT INTO livros ( titulo, autor, preco, quantidade ) VALUES (?, ?, ?, ?)",
        [ titulo, autor, preco, quantidade ],
        function(err, results) {

            if (err) {
                return res.status(500).json({
                    mensagem: "Erro ao cadastrar livro."
                });
            }

            res.status(201).json({
                mensagem: "Livro cadastrado com sucesso!",
                id: results.insertId
            });

        }
    );

});

app.put("/livros/:id", function(req, res) {

    const id = req.params.id;

    const {  titulo, autor, preco, quantidade  } = req.body;
  
if (typeof titulo !== "string" || !titulo.trim()) {
    return res.status(400).json({
        mensagem: "O título é obrigatório."
    });
}

if (typeof autor !== "string" || !autor.trim()) {
    return res.status(400).json({
        mensagem: "O autor é obrigatório."
    });
}
if (preco === undefined || preco === "") {
    return res.status(400).json({
        mensagem: "O preço é obrigatório."
    });
}

if (!Number.isFinite(preco)) {
    return res.status(400).json({
        mensagem: "O preço deve ser um número válido."
    });
}

if (preco <= 0) {
    return res.status(400).json({
        mensagem: "O preço deve ser maior que zero."
    });
}

if (quantidade === undefined || quantidade === "") {
    return res.status(400).json({
        mensagem: "A quantidade é obrigatória."
    });
}
if (!Number.isFinite(quantidade)) {
    return res.status(400).json({
        mensagem: "A quantidade deve ser um número válido."
    });
}
if (!Number.isInteger(quantidade)) {
    return res.status(400).json({
        mensagem: "A quantidade deve ser um número inteiro."
    });
}
if (quantidade < 0) {
    return res.status(400).json({
        mensagem: "A quantidade não pode ser negativa."
    });
}
    conexao.query(
        `UPDATE livros
         SET titulo = ?, autor = ?, preco = ?, quantidade = ?
         WHERE id = ?`,
        [ titulo, autor, preco, quantidade , id],
        function(err, results) {

            if (err) {
                return res.status(500).json({
                    mensagem: "Erro ao atualizar livro."
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Livro não encontrado."
                });
            }

            res.json({
                mensagem: "Livro atualizado com sucesso!"
            });

        }
    );

});

app.delete("/livros/:id", function(req, res) {

    const id = req.params.id;

    conexao.query(
        "DELETE FROM livros WHERE id = ?",
        [id],
        function(err, results) {

            if (err) {
                return res.status(500).json({
                    mensagem: "Erro ao remover livro."
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Livro não encontrado."
                });
            }

            res.json({
                mensagem: "Livro removido com sucesso!"
            });

        }
    );

});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});