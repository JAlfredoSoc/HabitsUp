// creators/WhatsAppNotificationCreator.js

const NotificacionCreador = require("../creadores/NotificacionCreador");
const WhatsAppNotificacion = require("../productos/WhatsAppNotificacion");

class WhatsAppNotificacionCreador extends NotificacionCreador {
  crearNotificacion(data) {
    return new WhatsAppNotificacion(data);
  }
}

module.exports = WhatsAppNotificacionCreador;
