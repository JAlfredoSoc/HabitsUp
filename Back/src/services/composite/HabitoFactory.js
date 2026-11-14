const HabitoSimple = require("./HabitoSimple");
const HabitoCompuesto = require("./HabitoCompuesto");

class HabitoFactory {
    static crear(habito) {
        if (habito.subHabitos && habito.subHabitos.length > 0) {
            return new HabitoCompuesto(habito);
        }
        return new HabitoSimple(habito);
    }
}

module.exports = HabitoFactory;