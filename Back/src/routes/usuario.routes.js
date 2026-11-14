const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuario.controller");
const habitoController = require("../controllers/habito.controller");
const historialController = require("../controllers/historial.controller");

router.post("/RegistroUsuario", usuarioController.registrarUsuario.bind(usuarioController));
router.post("/IniciarSesion", usuarioController.iniciarSesion.bind(usuarioController));
router.put("/EditarUsuario/:usuarioID", usuarioController.editarUsuario.bind(usuarioController));
// router.put("/SeleccionarHabitos", habitoController.seleccionarHabito.bind(habitoController));
router.get("/usuario/:usuarioId/habitos", usuarioController.consultarHabitosUsuario.bind(usuarioController));
router.get("/totalHabitosActivos/:usuarioId", usuarioController.totalHabitosActivosUsuario.bind(usuarioController));
router.get("/historial/:usuario", historialController.obtenerHistorialUsuario.bind(historialController));
router.get("/estadisticas/:usuarioId", usuarioController.estadisticasUsuario);

module.exports = router;