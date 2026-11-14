const mongoose = require("mongoose");

const usuarioEsquema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    contrasena: { type: String, required: true },
    edad: { type: String, required: true },
    telefono: { type: String, required: true },
    telegramChatId: {
      type: String,
      default: "",
    }, 
    habitos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habito",
      },
    ],
  },
  { collection: "Usuarios" },
);

module.exports = mongoose.model("Usuario", usuarioEsquema);
