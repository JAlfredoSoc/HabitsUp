// src/models/habit.model.js

const mongoose = require("mongoose");


const sugerenciaHabitoEsquema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
    },
}, {
    collection: "SugerenciasHabitos"
});

module.exports = mongoose.model("SugerenciaHabito", sugerenciaHabitoEsquema);
