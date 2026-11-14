const ProgresoStrategy = require("./ProgresoStrategy");

class ProgresoDiario extends ProgresoStrategy {
    calcularLimite(progreso) {
        return progreso.frecuencia;
    }
}

module.exports = ProgresoDiario;