const ProgresoStrategy = require("./ProgresoStrategy");

class ProgresoSemanal extends ProgresoStrategy {
    calcularLimite(progreso) {
        return progreso.frecuenciaSemanal || progreso.frecuencia;
    }
}

module.exports = ProgresoSemanal;