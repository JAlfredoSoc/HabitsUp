// products/WhatsAppNotification.js

class WhatsAppNotificacion {
  constructor(data) {
    this.habito_id = data.habito_id;
    this.type = "whatsapp";
    this.tituloNotificacion = "WhatsApp";
    this.descripcionNotificacion = `Mensaje de WhatsApp: ${data.name}`;
    this.fechaEnvio = data.scheduledTime;
  }
}

module.exports = WhatsAppNotificacion;