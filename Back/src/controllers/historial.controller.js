const HistorialHabito = require("../models/historialHabito.model");

const mongoose = require("mongoose");

class HistorialController {
    async obtenerHistorialUsuario(req, res) {
        try {
            const { usuario } = req.params;

            // ✅ VALIDAR PRIMERO
            if (!mongoose.Types.ObjectId.isValid(usuario)) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const historial = await HistorialHabito.find({
                usuario: new mongoose.Types.ObjectId(usuario)
            })
                .populate("habito", "nombre descripcion")
                .sort({ fecha: -1 });
            console.log("Historial encontrado:", historial.length); // 👈 DEBUG

            res.json({
                success: true,
                data: historial,
            });

        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = new HistorialController();