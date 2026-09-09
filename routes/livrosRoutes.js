const express = require("express");
const livrosController = require("../controllers/livrosController");

const router = express.Router();

router.get("/", livrosController.listar);
router.get("/:id", livrosController.buscarPorId);
router.post("/", livrosController.cadastrar);
router.put("/:id", livrosController.atualizar);
router.delete("/:id", livrosController.remover);
router.post("/:id/vender", livrosController.vender);


module.exports = router;