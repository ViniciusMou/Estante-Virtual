const readline = require("readline");
const funcoes = require("./funcoes/livrosFuncoes");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function iniciarSistema() {

  console.log("\n=== ESTANTE VIRTUAL ===");
  console.log("1 - Listar livros");
  console.log("2 - Cadastrar livro");
  console.log("3 - Buscar livro");
  console.log("4 - Remover livro");
  console.log("5 - Editar livro");
  console.log("6 - Vender livro");
  console.log("0 - Sair");

  rl.question("Escolha uma opção: ", function(resposta) {

    if (resposta == 1) {

      let listaLivros = funcoes.listarLivros();

if (listaLivros.length === 0) {

  console.log("Nenhum livro cadastrado.");

} else {

  listaLivros.forEach(livro => {

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

iniciarSistema();
    }

    else if (resposta == 2) {

      rl.question("Nome do livro: ", function(nome) {

        rl.question("Autor do livro: ", function(autor) {

          rl.question("Preço do livro: ", function(preco) {

            rl.question("Quantidade em estoque: ", function(estoque) {

              console.log(
                funcoes.cadastrarLivro(
                  nome,
                  autor,
                  Number(preco),
                  Number(estoque)
                )
              );

              iniciarSistema();

            });

          });

        });

      });

    }

   else if (resposta == 3) {

  rl.question("Digite o nome do livro: ", function(nome) {

    let resultados = funcoes.buscarLivro(nome);

    if (resultados.length === 0) {

      console.log("Livro não encontrado.");

    } else {

      resultados.forEach(livro => {

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

    iniciarSistema();

  });

}
    else if (resposta == 4) {

      rl.question("Digite o ID do livro: ", function(id) {

        console.log(
          funcoes.removerLivro(Number(id))
        );

        iniciarSistema();

      });

    }

    else if (resposta == 5) {

      rl.question("Digite o ID do livro: ", function(id) {

        rl.question("Novo nome: ", function(nome) {

          rl.question("Novo autor: ", function(autor) {

            rl.question("Novo preço: ", function(preco) {

              rl.question("Novo estoque: ", function(estoque) {

                console.log(
                  funcoes.editarLivro(
                    Number(id),
                    nome,
                    autor,
                    Number(preco),
                    Number(estoque)
                  )
                );

                iniciarSistema();

              });

            });

          });

        });

      });

    }

    else if (resposta == 6) {

      rl.question("Digite o ID do livro: ", function(id) {

        console.log(
          funcoes.venderLivro(Number(id))
        );

        iniciarSistema();

      });

    }

    else if (resposta == 0) {

      console.log("Sistema encerrado.");
      rl.close();
    }

    else {

      console.log("Opção inválida.");

      iniciarSistema();
    }

  });

}

iniciarSistema();