const livrosRepository = require("../repositories/livrosRepository");

async function listarLivros(busca, limite, offset) {

    const livros = await livrosRepository.listar(busca, limite, offset);
    const total = await livrosRepository.contarLivros(busca);

    return {
        livros,
        total
    };
}
async function buscarLivroPorId(id) {
    return  livrosRepository.buscarPorId(id);
}
async function cadastrarLivro(titulo, autor, preco, quantidade, isbn, capa_url) {
    return livrosRepository.cadastrar(
        titulo,
        autor,
        preco,
        quantidade,
        isbn,
        capa_url
    );
}
async function atualizarLivro(id, titulo, autor, preco, isbn, capa_url) {
    return livrosRepository.atualizar(
        id,
        titulo,
        autor,
        preco,
        isbn,
        capa_url
    );
}
async function removerLivro(id) {
    return  livrosRepository.remover(id);
}
async function venderLivro(id, quantidade) {
    const livro = await livrosRepository.buscarPorId(id);

    if (!livro) {
        return {
            resultado: "nao_encontrado"
        };
    }

    if (livro.quantidade < quantidade) {
    return {
        resultado: "sem_estoque"
    };
}

   const linhasAfetadas = await livrosRepository.registrarVenda(id, quantidade);

    if (linhasAfetadas === 0) {
        return {
            resultado: "sem_estoque"
        };
    }

   return {
    resultado: "sucesso",
    quantidadeVendida: quantidade,
    estoqueRestante: livro.quantidade - quantidade
};
}

async function registrarEntradaEstoque(id, quantidade) {


    if (quantidade <= 0) {
        return {
            resultado: "quantidade_invalida"
        };
    }


const livro = await livrosRepository.buscarPorId(id);


    if (!livro) {
        return {
            resultado: "nao_encontrado"
        };
    }

    const linhasAfetadas = await livrosRepository.registrarEntradaEstoque(
        id,
        quantidade
    );

    if (linhasAfetadas === 0) {
        return {
            resultado: "nao_encontrado"
        };
    }

    return {
        resultado: "sucesso",
        quantidadeAdicionada: quantidade,
        estoqueAtual: livro.quantidade + quantidade
    };
}

module.exports = {
    listarLivros,
    buscarLivroPorId,
    cadastrarLivro,
    atualizarLivro,
    removerLivro,
    venderLivro,
    registrarEntradaEstoque
};