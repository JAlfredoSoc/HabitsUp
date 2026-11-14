class EmailNotificacion {
  constructor(data) {
    this.habito_id = data.habito_id;
    this.type = "email";
    this.tituloNotificacion = "Email";
    this.descripcionNotificacion = `Email sobre tu hábito: ${data.name}`;
    this.fechaEnvio = data.scheduledTime;
  }
}

module.exports = EmailNotificacion; 