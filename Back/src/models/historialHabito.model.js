const mongoose = require("mongoose");

const historialHabitoSchema = new mongoose.Schema({
    habito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habito",
        required: true,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    accion: {
        type: String,
        enum: [
            "CREADO",
            "EDITADO",
            "COMPLETADO",
            "ELIMINADO",
            "CLONADO",
            "PROGRESO_ACTUALIZADO",
            "NO COMPLETADO"
        ],
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    detalle: {
        type: String, // opcional: "Se cambió la frecuencia", etc.
    },
},{
    collection: "historialhabitos",
});

module.exports = mongoose.model("HistorialHabito", historialHabitoSchema);