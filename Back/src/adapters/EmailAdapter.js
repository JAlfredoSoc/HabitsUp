const nodemailer = require("nodemailer");
const NotificacionAdapter = require("./NotificacionAdapter");

class EmailAdapter extends NotificacionAdapter {
  constructor() {
    super();

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async enviar(usuario, habito) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: usuario.correo,
      subject: "Recordatorio de hábito",
      text: `Recuerda completar tu hábito: ${habito.nombre}`,
    });

    console.log("📧 Email enviado");
  }
}

module.exports = EmailAdapter;