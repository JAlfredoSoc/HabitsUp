// products/ReminderNotification.js

class RecordatorioNotificacion {
  constructor(data) {
    this.habito_id = data.habito_id;
    this.type = "recordatorio";
    this.tituloNotificacion = "Recordatorio";
    this.descripcionNotificacion = `Recuerda tu hábito: ${data.name}`;
    this.fechaEnvio = data.scheduledTime;
  }
}

module.exports = RecordatorioNotificacion;