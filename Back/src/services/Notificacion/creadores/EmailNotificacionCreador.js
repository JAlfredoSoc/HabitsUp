// creators/EmailNotificationCreator.js

const NotificacionCreador = require("../creadores/NotificacionCreador");
const EmailNotificacion = require("../productos/EmailNotifiacion");

class EmailNotificacionCreador extends NotificacionCreador {
  crearNotificacion(data) {
    return new EmailNotificacion(data);
  }
}

module.exports = EmailNotificacionCreador;