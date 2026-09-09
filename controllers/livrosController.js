const livrosService = require("../services/livrosService");
function validarDadosLivro(titulo, autor, preco, quantidade) {
    if (typeof titulo !== "string" || !titulo.trim()) {
        return "O título é obrigatório.";
    }

    if (typeof autor !== "string" || !autor.trim()) {
        return "O autor é obrigatório.";
    }

    if (preco === undefined || preco === "") {
        return "O preço é obrigatório.";
    }

    if (!Number.isFinite(preco)) {
        return "O preço deve ser um número válido.";
    }

    if (preco <= 0) {
        return "O preço deve ser maior que zero.";
    }

    if (quantidade === undefined || quantidade === "") {
        return "A quantidade é obrigatória.";
    }

    if (!Number.isFinite(quantidade)) {
        return "A quantidade deve ser um número válido.";
    }

    if (!Number.isInteger(quantidade)) {
        return "A quantidade deve ser um número inteiro.";
    }

    if (quantidade < 0) {
        return "A quantidade não pode ser negativa.";
    }

    return null;
}
async function listar(req, res) {
    const busca = req.query.busca;

    const pagina = req.query.pagina === undefined
        ? 1
        : Number(req.query.pagina);

    const limite = req.query.limite === undefined
        ? 20
        : Number(req.query.limite);

    if (!Number.isInteger(pagina) || pagina <= 0) {
        return res.status(400).json({
            mensagem: "A página deve ser um número inteiro maior que zero."
        });
    }

    if (!Number.isInteger(limite) || limite <= 0) {
        return res.status(400).json({
            mensagem: "O limite deve ser um número inteiro maior que zero."
        });
    }

    if (limite > 100) {
        return res.status(400).json({
            mensagem: "O limite máximo é de 100 livros."
        });
    }

    const offset = (pagina - 1) * limite;

    try {
        const livros = await livrosService.listarLivros(
            busca,
            limite,
            offset
        );

        return res.json(livros);
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar livros."
        });
    }
}
async function buscarPorId(req, res) {
    const id = req.params.id;

    try {
        const livro = await livrosService.buscarLivroPorId(id);

        if (!livro) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        return res.json(livro);
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao buscar livro."
        });
    }
}
async function cadastrar(req, res) {
    const { titulo, autor, preco, quantidade } = req.body;

    const erroValidacao = validarDadosLivro(
        titulo,
        autor,
        preco,
        quantidade
    );

    if (erroValidacao) {
        return res.status(400).json({
            mensagem: erroValidacao
        });
    }

    try {
        const id = await livrosService.cadastrarLivro(
            titulo,
            autor,
            preco,
            quantidade
        );

        return res.status(201).json({
            mensagem: "Livro cadastrado com sucesso!",
            id: id
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao cadastrar livro."
        });
    }
}
async function atualizar(req, res) {
    const id = req.params.id;
    const { titulo, autor, preco, quantidade } = req.body;

    const erroValidacao = validarDadosLivro(
        titulo,
        autor,
        preco,
        quantidade
    );

    if (erroValidacao) {
        return res.status(400).json({
            mensagem: erroValidacao
        });
    }

    try {
        const linhasAfetadas = await livrosService.atualizarLivro(
            id,
            titulo,
            autor,
            preco,
            quantidade
        );

        if (linhasAfetadas === 0) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        return res.json({
            mensagem: "Livro atualizado com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao atualizar livro."
        });
    }
}
async function remover(req, res) {
    const id = req.params.id;

    try {
        const linhasAfetadas = await livrosService.removerLivro(id);

        if (linhasAfetadas === 0) {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        return res.json({
            mensagem: "Livro removido com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao remover livro."
        });
    }
}
async function vender(req, res) {
    const id = req.params.id;

    try {
        const venda = await livrosService.venderLivro(id);

        if (venda.resultado === "nao_encontrado") {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        if (venda.resultado === "sem_estoque") {
            return res.status(400).json({
                mensagem: "Livro sem estoque."
            });
        }

        return res.json({
            mensagem: "Venda registrada com sucesso!"
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao registrar venda."
        });
    }
}
module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    remover,
    vender
};