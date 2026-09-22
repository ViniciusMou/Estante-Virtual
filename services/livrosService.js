const livrosRepository = require("../repositories/livrosRepository");

async function listarLivros(busca, limite, offset) {
    return  livrosRepository.listar(busca, limite, offset);
}
async function buscarLivroPorId(id) {
    return  livrosRepository.buscarPorId(id);
}
async function cadastrarLivro(titulo, autor, preco, quantidade) {
    return  livrosRepository.cadastrar(
        titulo,
        autor,
        preco,
        quantidade
    );
}
async function atualizarLivro(id, titulo, autor, preco, quantidade) {
    return  livrosRepository.atualizar(
        id,
        titulo,
        autor,
        preco,
        quantidade
    );
}
async function removerLivro(id) {
    return  livrosRepository.remover(id);
}
async function venderLivro(id) {
    const livro = await livrosRepository.buscarPorId(id);

    if (!livro) {
        return {
            resultado: "nao_encontrado"
        };
    }

    if (livro.quantidade <= 0) {
        return {
            resultado: "sem_estoque"
        };
    }

    const linhasAfetadas = await livrosRepository.registrarVenda(id);

    if (linhasAfetadas === 0) {
        return {
            resultado: "sem_estoque"
        };
    }

    return {
        resultado: "sucesso"
    };
}
module.exports = {
    listarLivros,
    buscarLivroPorId,
    cadastrarLivro,
    atualizarLivro,
    removerLivro,
    venderLivro
};