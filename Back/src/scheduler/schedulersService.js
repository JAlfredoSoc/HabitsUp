const cron = require("node-cron");

const Habito = require("../models/habito.model");
const Usuario = require("../models/usuario.model");

const obtenerAdapter = require("../services/notificacionAdapterFactory");

const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function iniciarScheduler() {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Revisando hábitos...");

    const ahora = new Date();

    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    const diaActual = diasSemana[ahora.getDay()];

    const habitos = await Habito.find().populate("notificaciones");

    for (const habito of habitos) {
      if (!habito.horario) continue;

      const fechaHabito = new Date(habito.horario);

      const horaHabito = fechaHabito.getHours();
      const minutoHabito = fechaHabito.getMinutes();

      const coincideHora =
        horaHabito === horaActual &&
        minutoHabito === minutoActual;

      const coincideDia =
        habito.diasSeleccionados.includes(diaActual);

      if (coincideHora && coincideDia) {
        console.log(`🔥 Enviando recordatorio para ${habito.nombre}`);

        const usuario = await Usuario.findOne({
          habitos: habito._id,
        });

        if (!usuario) continue;

        for (const notificacion of habito.notificaciones) {
          const adapter = obtenerAdapter(notificacion.type);

          if (adapter) {
            await adapter.enviar(usuario, habito);
          }
        }
      }
    }
  });
}

module.exports = iniciarScheduler;