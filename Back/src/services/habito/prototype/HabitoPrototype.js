const Habito = require("../../../models/habito.model");
const Progreso = require("../../../models/progresoHabito.model");
const Notificacion = require("../../../models/notificacion.model");
const Usuario = require("../../../models/usuario.model");

class HabitoPrototype {
  async clonarHabito(habitoID, usuarioId) {
    // OBTENER EL HABITO ORIGINAL
    const habitoOriginal = await Habito.findById(habitoID)
      .populate("progreso")
      .populate("notificaciones");

    if (!habitoOriginal) {
      throw new Error("Hábito no encontrado");
    }

    // HABITO SIN ID
    const nuevoHabito = new Habito({
      nombre: habitoOriginal.nombre + " (copia)",
      descripcion: habitoOriginal.descripcion,
      estado: "pendiente",
      horario: habitoOriginal.horario,
      fechaInicio: new Date(),
      fechaFin: habitoOriginal.fechaFin,
      categoria: habitoOriginal.categoria,
      diasSeleccionados: habitoOriginal.diasSeleccionados || [],
    });

    const habitoClonado = await nuevoHabito.save();
    console.log("📝 Hábito clonado guardado:", habitoClonado._id);
    // CLONAR PROGRESO
    let progresoClonado = null;

    if (habitoOriginal.progreso) {
      progresoClonado = await Progreso.create({
        habito: habitoClonado._id,
        periodo: habitoOriginal.progreso.periodo,
        frecuencia: habitoOriginal.progreso.frecuencia,
        progreso: 0, // reiniciado
        frecuenciaSemanal: habitoOriginal.progreso.frecuenciaSemanal,
      });

      habitoClonado.progreso = progresoClonado._id;
      await habitoClonado.save();
    }

    // CLONAR NOTIFIACIONES
    const nuevasNotificaciones = [];

    for (let notif of habitoOriginal.notificaciones) {
      const nuevaNotif = await Notificacion.create({
        habito_id: habitoClonado._id,
        type: notif.type,
        tituloNotificacion: notif.tituloNotificacion,
        descripcionNotificacion: notif.descripcionNotificacion,
        fechaEnvio: notif.fechaEnvio,
      });

      nuevasNotificaciones.push(nuevaNotif._id);
    }

    // vincular notificaciones
    habitoClonado.notificaciones = nuevasNotificaciones;
    await habitoClonado.save();

    //ASOCIAR AL USUARIO
    await Usuario.findByIdAndUpdate(usuarioId, {
      $addToSet: { habitos: habitoClonado._id },
    });

    return habitoClonado;
  }
}

module.exports = new HabitoPrototype();
