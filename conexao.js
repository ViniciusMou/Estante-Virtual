const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'estante_virtual',
    port: 3306
});

conexao.connect((err) => {
    if (err) {
        console.log('Erro ao conectar:', err);
        return;
    }

    console.log('Conectado ao MySQL!');

    conexao.query("SELECT * FROM livros", (err, results) => {
        if (err) {
            console.log("Erro na consulta:", err);
            return;
        }

        console.log("Livros cadastrados:");
        console.log(results);

        conexao.end();
    });
});