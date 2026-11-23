
const express = require("express");
const router = express.Router();

const habitoConroller = require("../controllers/habito.controller");
const progresoController = require("../controllers/progreso.controller");
const sugerenciaHabitoController = require("../controllers/sugerenciaHabito.controller");

router.post("/CrearHabitos", habitoConroller.crearHabito.bind(habitoConroller));
router.get("/ObtenerCategoria", habitoConroller.obtenerCategorias.bind(habitoConroller));
router.put("/ActualizarProgreso/:habitoId", progresoController.actualizarProgreso.bind(progresoController));
router.get("/ObtenerSugerencias", sugerenciaHabitoController.obtenerSugerenciaHabito.bind(sugerenciaHabitoController));
router.get("/ObtenerHabitos/:usuarioID", habitoConroller.obtenerHabitosPorUsuario.bind(habitoConroller));
router.get("/habito/:id", habitoConroller.obtenerHabitoPorId.bind(habitoConroller));
router.post("/clonar/:habitoId", habitoConroller.clonarHabito.bind(habitoConroller));
router.put("/editar/:habitoId", habitoConroller.editarHabito.bind(habitoConroller));
router.delete("/eliminar/:habitoId", habitoConroller.eliminarHabito.bind(habitoConroller));

module.exports = router;