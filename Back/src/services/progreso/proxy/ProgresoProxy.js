const ProgresoService = require("../ProgresoService");
const Progreso = require("../../../models/progresoHabito.model");

class ProgresoProxy {
    constructor() {
        this.service = new ProgresoService();
    }

    async actualizar(habitoId, usuarioId) {
        console.log("Proxy: validando acceso.");

        const progreso = await Progreso.findOne({ habito: habitoId });

        if (!progreso) {
            throw new Error("Progreso no encontrado");
        }

        // 🔥 VALIDACIÓN (clave del proxy)
        const limite =
            progreso.periodo === "semanal"
                ? progreso.frecuenciaSemanal || progreso.frecuencia
                : progreso.frecuencia;

        if (progreso.progreso >= limite) {
            throw new Error("El hábito ya está completado");
        }

        // 🔥 LOG
        console.log(`Usuario ${usuarioId} intenta actualizar hábito ${habitoId}`);

        // 🔥 delega al servicio real
        return await this.service.actualizar(habitoId);
    }
}

module.exports = ProgresoProxy;