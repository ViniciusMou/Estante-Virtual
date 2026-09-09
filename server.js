const express = require("express");
const livrosRoutes = require("./routes/livrosRoutes");
const app = express();

app.use(express.json());
app.use("/livros", livrosRoutes);




app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});