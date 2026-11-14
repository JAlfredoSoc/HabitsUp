// products/TelegramNotificacion.js

const TelegramAdapter = require("../../../adapters/TelegramAdapter");

class TelegramNotificacion {
  constructor(data) {
    this.habito_id = data.habito_id;
    this.type = "telegram";
    this.tituloNotificacion = "Telegram";
    this.descripcionNotificacion = `Mensaje de Telegram: ${data.name}`;
    this.fechaEnvio = data.scheduledTime;
    this.adapter = new TelegramAdapter();
  }

  async enviar(usuario, habito) {
    await this.adapter.enviar(usuario, habito);
  }
}

module.exports = TelegramNotificacion;
