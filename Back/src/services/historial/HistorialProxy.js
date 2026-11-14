const registrarHistorial = require("../../helper/registrarHistorial");

class HistorialProxy {
    async ejecutar({ habitoId, usuarioId, accion, detalle }, callback) {
        const resultado = await callback();

        await registrarHistorial({
            habitoId,
            usuarioId,
            accion,
            detalle,
        });

        return resultado;
    }
}

module.exports = HistorialProxy;