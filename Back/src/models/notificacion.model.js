const mongoose = require("mongoose");

const notificacionEsquema = mongoose.Schema({
    habito_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habito",
        required: true
    },
    type: {
        type: String
    },
    tituloNotificacion: { type: String, required: true },
    descripcionNotificacion: { type: String, required: true },
    fechaEnvio: { type: Date, required: true }
}, {
    collection: "Notificacion"
});

// 🔥 también aplica esto aquí
module.exports = mongoose.models.Notificacion || mongoose.model("Notificacion", notificacionEsquema);