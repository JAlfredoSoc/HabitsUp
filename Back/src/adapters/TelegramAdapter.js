const TelegramBot = require("node-telegram-bot-api");
const NotificacionAdapter = require("./NotificacionAdapter");

class TelegramAdapter extends NotificacionAdapter {
  constructor() {
    super();

    this.bot = new TelegramBot(
      process.env.TELEGRAM_BOT_TOKEN,
      { polling: false }
    );
  }

  async enviar(usuario, habito) {
    await this.bot.sendMessage(
      process.env.TELEGRAM_CHAT_ID,
      `🔔 Recuerda completar tu hábito: ${habito.nombre}`
    );

    console.log("📲 Telegram enviado");
  }
}

module.exports = TelegramAdapter;