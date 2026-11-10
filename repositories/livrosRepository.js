const conexao = require("../conexao");

async function listar(busca, limite, offset) {
    let sql;
    let valores;

    if (busca) {
        sql = `
            SELECT * FROM livros
            WHERE titulo LIKE ? OR autor LIKE ?
            ORDER BY id ASC
            LIMIT ? OFFSET ?
        `;

        valores = [`%${busca}%`, `%${busca}%`, limite, offset];
    } else {
        sql = `
            SELECT * FROM livros
            ORDER BY id ASC
            LIMIT ? OFFSET ?
        `;

        valores = [limite, offset];
    }

    const [livros] = await conexao.promise().query(sql, valores);

    return livros;
}
async function buscarPorId(id) {
    const sql = "SELECT * FROM livros WHERE id = ?";

    const [livros] = await conexao.promise().query(sql, [id]);

    return livros[0];
}
async function cadastrar(titulo, autor, preco, quantidade, isbn, capa_url) {
    const sql = `
        INSERT INTO livros (titulo, autor, preco, quantidade, isbn, capa_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [resultado] = await conexao.promise().query(
        sql,
        [titulo, autor, preco, quantidade, isbn, capa_url]
    );

    return resultado.insertId;
}
async function atualizar(id, titulo, autor, preco, isbn, capa_url) {
    const sql = `
        UPDATE livros
        SET titulo = ?, autor = ?, preco = ?, isbn = ?, capa_url = ?
        WHERE id = ?
    `;

    const [resultado] = await conexao.promise().query(
        sql,
        [titulo, autor, preco, isbn, capa_url, id]
    );

    return resultado.affectedRows;
}
async function remover(id) {
    const sql = "DELETE FROM livros WHERE id = ?";

    const [resultado] = await conexao.promise().query(sql, [id]);

    return resultado.affectedRows;


}

async function registrarVenda(id, quantidadeVenda) {
    const sql = `
        UPDATE livros
        SET quantidade = quantidade - ?,
            vendidos = vendidos + ?
        WHERE id = ? AND quantidade >= ?
    `;

 const [resultado] = await conexao.promise().query(
    sql,
    [quantidadeVenda, quantidadeVenda, id, quantidadeVenda]
);


    return resultado.affectedRows;
}
async function registrarEntradaEstoque(id, quantidade) {
  const sql = `
        UPDATE livros
        SET quantidade = quantidade + ?
        WHERE id = ?
    `;

    const [resultado] = await conexao.promise().query(
        sql,
        [quantidade, id]
    );

    return resultado.affectedRows;
}
async function contarLivros(busca) {
    let sql;
    let valores;

    if (busca) {
        sql = `
            SELECT COUNT(*) AS total
            FROM livros
            WHERE titulo LIKE ? OR autor LIKE ?
        `;

        valores = [`%${busca}%`, `%${busca}%`];

    } else {
        sql = `
            SELECT COUNT(*) AS total
            FROM livros
        `;

        valores = [];
    }

    const [resultado] = await conexao.promise().query(sql, valores);

    return resultado[0].total;
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    remover,
    registrarVenda,
    registrarEntradaEstoque,
    contarLivros
};