// creators/TelegramNotificacionCreador.js

const NotificacionCreador = require("../creadores/NotificacionCreador");
const TelegramNotificacion = require("../productos/TelegramNotificacion");

class TelegramNotificacionCreador extends NotificacionCreador {
  crearNotificacion(data) {
    return new TelegramNotificacion(data);
  }
}

module.exports = TelegramNotificacionCreador;
