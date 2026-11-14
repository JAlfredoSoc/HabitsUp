// src/models/habit.model.js

const mongoose = require("mongoose");

const habitoEsquema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "completado"],
      default: "pendiente",
    },
    horario: { type: Date, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, default: null },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
    },
    diasSeleccionados:{
      type: [String],
      default: []
    },
    frecuenciaSemanal: {
      type: Number,
      default: 0,
    },
    progreso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Progreso",
    },
    notificaciones: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Notificacion",
        },
      ],
      default: [],
    },
    subHabitos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habito",
      }
    ],
  },
  {
    collection: "Habitos",
  },
);

module.exports = mongoose.models.Habito || mongoose.model("Habito", habitoEsquema);