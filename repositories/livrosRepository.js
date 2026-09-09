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
async function cadastrar(titulo, autor, preco, quantidade) {
    const sql = `
        INSERT INTO livros (titulo, autor, preco, quantidade)
        VALUES (?, ?, ?, ?)
    `;

    const [resultado] = await conexao.promise().query(
        sql,
        [titulo, autor, preco, quantidade]
    );

    return resultado.insertId;
}
async function atualizar(id, titulo, autor, preco, quantidade) {
    const sql = `
        UPDATE livros
        SET titulo = ?, autor = ?, preco = ?, quantidade = ?
        WHERE id = ?
    `;

    const [resultado] = await conexao.promise().query(
        sql,
        [titulo, autor, preco, quantidade, id]
    );

    return resultado.affectedRows;
}
async function remover(id) {
    const sql = "DELETE FROM livros WHERE id = ?";

    const [resultado] = await conexao.promise().query(sql, [id]);

    return resultado.affectedRows;


}

   async function registrarVenda(id) {
    const sql = `
        UPDATE livros
        SET quantidade = quantidade - 1,
            vendidos = vendidos + 1
        WHERE id = ? AND quantidade > 0
    `;

    const [resultado] = await conexao.promise().query(sql, [id]);

    return resultado.affectedRows;
}
module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    remover,
    registrarVenda
};