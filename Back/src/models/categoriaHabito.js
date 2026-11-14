const mongoose = require("mongoose");

const categoriaEsquema = new mongoose.Schema({
  // _id: { type: Number, required: true },
  nombreCategoria: { type: String, required: true },
},{collection: "CategoriaHabito",}
);

module.exports = mongoose.model("Categoria", categoriaEsquema);
