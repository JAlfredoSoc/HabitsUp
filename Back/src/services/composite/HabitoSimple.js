const HabitoComponent = require("./HabitoComponent");
const Habito = require("../../../models/habito.model");

class HabitoSimple extends HabitoComponent {
    constructor(habito) {
        super();
        this.habito = habito;
    }

    async completar() {
        this.habito.estado = "completado";
        await this.habito.save();
    }
}

module.exports = HabitoSimple;