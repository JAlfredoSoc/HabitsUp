const SugerenciaHabito = require("../models/sugerenciaHabito.model");

class SugerenciaHabitoController {

    async obtenerSugerenciaHabito(req, res) {
        try {
            const nuevaSugerencia = await SugerenciaHabito.find().populate("categoria");
            res.json(nuevaSugerencia);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new SugerenciaHabitoController();