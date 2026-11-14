const HistorialHabito = require("../models/historialHabito.model");

const registrarHistorial = async ({
  habitoId,
  usuarioId,
  accion,
  detalle = "",
}) => {
  await HistorialHabito.create({
    habito: habitoId,
    usuario: usuarioId,
    accion,
    detalle,
  });
};

module.exports = registrarHistorial;