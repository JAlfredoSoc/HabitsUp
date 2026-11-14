const NotificacionAdapter = require("./NotificacionAdapter");

class InternaAdapter extends NotificacionAdapter {
  async enviar(usuario, habito) {
    console.log("🔔 Notificación interna enviada");

    return {
      tipo: "interna",
      mensaje: `Recuerda completar: ${habito.nombre}`,
    };
  }
}

module.exports = InternaAdapter;