const Progreso = require("../../models/progresoHabito.model");
const ProgresoBridge = require("./strategies/ProgresoBridge");

class ProgresoService {
    async actualizar(habitoId) {
        const progreso = await Progreso.findOne({ habito: habitoId });

        if (!progreso) {
            throw new Error("Progreso no encontrado");
        }

        // 🔥 Bridge
        const strategy = ProgresoBridge.obtenerStrategy(progreso.periodo);
        const limite = strategy.calcularLimite(progreso);

        progreso.progreso += 1;

        if (progreso.progreso > limite) {
            progreso.progreso = limite;
        }

        await progreso.save();

        return { progreso, limite };
    }
}

module.exports = ProgresoService;