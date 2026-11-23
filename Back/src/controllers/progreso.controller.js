const mongoose = require("mongoose");
const ProgresoProxy = require("../services/progreso/proxy/ProgresoProxy");
const HistorialProxy = require("../services/historial/HistorialProxy");

class ProgresoController {
  async actualizarProgreso(req, res) {
    try {
      const { habitoId } = req.params;
      const { usuarioId } = req.body || {};

      if (!mongoose.Types.ObjectId.isValid(habitoId)) {
        return res.status(400).json({ message: "ID de hábito inválido" });
      }

      if (!usuarioId) {
        return res.status(400).json({ message: "usuarioId es obligatorio" });
      }

      const proxy = new ProgresoProxy();
      const historialProxy = new HistorialProxy();

      const { progreso, limite } = await historialProxy.ejecutar(
        {
          habitoId,
          usuarioId,
          accion: "PROGRESO_ACTUALIZADO",
          detalle: "Actualización de progreso",
        },
        () => proxy.actualizar(habitoId, usuarioId)
      );

      res.json({
        message: "Progreso actualizado",
        progreso,
        limite,
      });
    } catch (error) {
      if (error.message === "Progreso no encontrado") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "El hábito ya está completado") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProgresoController();
