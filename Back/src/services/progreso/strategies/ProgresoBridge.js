const ProgresoDiario = require("./ProgresoDiario");
const ProgresoSemanal = require("./ProgresoSemanal");
const ProgresoMensual = require("./ProgresoMensual");

class ProgresoBridge {
    static obtenerStrategy(periodo) {
        switch (periodo) {
            case "diario":
                return new ProgresoDiario();

            case "semanal":
                return new ProgresoSemanal();

            case "mensual":
                return new ProgresoMensual();

            default:
                throw new Error("Tipo de progreso no soportado");
        }
    }
}

module.exports = ProgresoBridge;