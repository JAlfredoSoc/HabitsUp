// creators/ReminderNotificationCreator.js

const NotificacionCreador = require("../creadores/NotificacionCreador");
const RecordarNotificacion = require("../productos/RecordatorioNotificacion");

class RecordatorioNotifiacionCreador extends NotificacionCreador {
  crearNotificacion(data) {
    return new RecordarNotificacion(data);
  }
}

module.exports = RecordatorioNotifiacionCreador;