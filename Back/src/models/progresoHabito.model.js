const mongoose = require("mongoose");

const progresoEsquema = new mongoose.Schema(
  {
    habito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habito",
    },
    periodo: { type: String, required: true },
    frecuencia: { type: Number, required: true },
    progreso: { type: Number, required: true },
    frecuenciaSemanal: { type: Number, required:true}, // Nuevo campo para frecuencia semanal
  },
  { collection: "Progreso" },
);

module.exports = mongoose.model("Progreso", progresoEsquema);
