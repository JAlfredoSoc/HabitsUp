const ProgresoStrategy = require("./ProgresoStrategy");

class ProgresoMensual extends ProgresoStrategy {
    calcularLimite(progreso) {
        return progreso.frecuencia;
    }
}

module.exports = ProgresoMensual;
