const fs = require("fs");

const livros = JSON.parse(
  fs.readFileSync("./dados/livros.json", "utf-8")
);

module.exports = livros;