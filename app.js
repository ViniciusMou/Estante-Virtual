const readline = require("readline");
const funcoes = require("./funcoes/livrosFuncoes");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function iniciarSistema() {

    console.log("=== ESTANTE VIRTUAL ===");
    console.log("1 - Listar livros");
    console.log("2 - Cadastrar livro");

    rl.question("Escolha uma opção: ", function(resposta) {

        if (resposta == 1) {
            console.log(funcoes.listarLivros());

            iniciarSistema();
        }

        if (resposta == 2) {

            rl.question("Nome do livro: ", function(nome) {

                rl.question("Autor do livro: ", function(autor) {

                    console.log(
                        funcoes.cadastrarLivro(nome, autor)
                    );

                    iniciarSistema();

                });
            });
        }

    });

}

iniciarSistema();