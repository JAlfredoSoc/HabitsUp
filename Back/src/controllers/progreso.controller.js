const ProgresoProxy = require("../services/progreso/proxy/ProgresoProxy");
const HistorialProxy = require("../services/historial/HistorialProxy");

class ProgresoController {
    async actualizarProgreso(req, res) {
        try {
            const { habitoId } = req.params;
            const { usuarioId } = req.body || {};
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
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ProgresoController();