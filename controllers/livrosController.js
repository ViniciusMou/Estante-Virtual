const livrosService = require("../services/livrosService");

function validarId(id) {
    const numero = Number(id);

    if (!Number.isInteger(numero) || numero <= 0) {
        return null;
    }

    return numero;
}

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
function validarDadosAtualizacao(titulo, autor, preco) {
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
    const id = validarId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro maior que zero."
        });
    }

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
    const { titulo, autor, preco, quantidade, isbn, capa_url } = req.body;

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

    const erroCapa = validarDadosCapa(isbn, capa_url);

    if (erroCapa) {
        return res.status(400).json({
            mensagem: erroCapa
        });
    }

    const tituloLimpo = titulo.trim();
    const autorLimpo = autor.trim();

    try {
      const id = await livrosService.cadastrarLivro(
    tituloLimpo,
    autorLimpo,
    preco,
    quantidade,
    isbn?.trim() || null,
    capa_url?.trim() || null
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
    const id = validarId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro maior que zero."
        });
    }
console.log("BODY:", req.body);
console.log("CONTENT-TYPE:", req.headers["content-type"]);


   const { titulo, autor, preco, isbn, capa_url } = req.body;
    console.log("DADOS RECEBIDOS:", req.body);
    const erroValidacao = validarDadosAtualizacao(
    titulo,
    autor,
    preco
);

    if (erroValidacao) {
        return res.status(400).json({
            mensagem: erroValidacao
        });
    }
const erroCapa = validarDadosCapa(isbn, capa_url);

if (erroCapa) {
    return res.status(400).json({
        mensagem: erroCapa
    });
}
    const tituloLimpo = titulo.trim();
    const autorLimpo = autor.trim();

    try {
        const linhasAfetadas = await livrosService.atualizarLivro(
    id,
    tituloLimpo,
    autorLimpo,
    preco,
    isbn?.trim() || null,
    capa_url?.trim() || null
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
function validarDadosCapa(isbn, capa_url) {
    if (isbn !== undefined && isbn !== null && isbn !== "") {
        if (typeof isbn !== "string" || isbn.length > 20) {
            return "O ISBN deve ser um texto de até 20 caracteres.";
        }
    }

    if (capa_url !== undefined && capa_url !== null && capa_url !== "") {
        if (typeof capa_url !== "string") {
            return "A URL da capa deve ser um texto válido.";
        }

        try {
            const url = new URL(capa_url);

            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return "A URL da capa deve utilizar HTTP ou HTTPS.";
            }
        } catch {
            return "A URL da capa é inválida.";
        }
    }

    return null;
}

async function remover(req, res) {
    const id = validarId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro maior que zero."
        });
    }

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
    const id = validarId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro maior que zero."
        });
    }
  const { quantidade } = req.body;

    if (
        !Number.isFinite(quantidade) ||
        !Number.isInteger(quantidade) ||
        quantidade < 1
    ) {
        return res.status(400).json({
            mensagem: "A quantidade deve ser um número inteiro maior que 0."
        });
    }

    try {
       const venda = await livrosService.venderLivro(id, quantidade);

        

        if (venda.resultado === "nao_encontrado") {
            return res.status(404).json({
                mensagem: "Livro não encontrado."
            });
        }

        if (venda.resultado === "sem_estoque") {
            return res.status(400).json({
                mensagem: "Não foi possível registrar a venda. O livro não possui estoque disponível."
            });
        }

       return res.json({
    mensagem: "Venda registrada com sucesso!",
    quantidadeVendida: venda.quantidadeVendida,
    estoqueRestante: venda.estoqueRestante
});
    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            mensagem: "Erro ao registrar venda."
        });
    }
}
async function entradaEstoque(req, res) {
  const id = validarId(req.params.id);

    if (id === null) {
        return res.status(400).json({
            mensagem: "O ID deve ser um número inteiro maior que zero."
        });
    }

    const { quantidade } = req.body;

    if (
        !Number.isFinite(quantidade) ||
        !Number.isInteger(quantidade) ||
        quantidade < 1
    ) {
        return res.status(400).json({
            mensagem: "A quantidade deve ser um número inteiro maior que 0."
        });
    }
    try {
    const entrada = await livrosService.registrarEntradaEstoque(
        id,
        quantidade
    );

    if (entrada.resultado === "nao_encontrado") {
        return res.status(404).json({
            mensagem: "Livro não encontrado."
        });
    }

    return res.json({
        mensagem: "Entrada de estoque registrada com sucesso!",
        quantidadeAdicionada: entrada.quantidadeAdicionada,
        estoqueAtual: entrada.estoqueAtual
    });
} catch (erro) {
    console.error(erro);

    return res.status(500).json({
        mensagem: "Erro ao registrar entrada de estoque."
    });
}
}


module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    remover,
    vender,
    entradaEstoque
};