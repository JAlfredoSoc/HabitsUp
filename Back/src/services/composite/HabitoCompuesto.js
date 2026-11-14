const HabitoComponent = require("./HabitoComponent");
const Habito = require("../../../models/habito.model");

class HabitoCompuesto extends HabitoComponent {
    constructor(habito) {
        super();
        this.habito = habito;
    }

    async completar() {
        // 🔥 completar hijos primero
        const habitoPopulado = await Habito.findById(this.habito._id)
            .populate("subHabitos");

        for (const sub of habitoPopulado.subHabitos) {
            const componente = require("./HabitoFactory").crear(sub);
            await componente.completar();
        }

        // 🔥 luego el padre
        this.habito.estado = "completado";
        await this.habito.save();
    }
}

module.exports = HabitoCompuesto;