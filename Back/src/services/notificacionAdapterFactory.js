const InternaAdapter = require("../adapters/InternaAdapter");
const EmailAdapter = require("../adapters/EmailAdapter");
const TelegramAdapter = require("../adapters/TelegramAdapter");

function obtenerAdapter(tipo) {
  switch (tipo) {
    case "interna":
      return new InternaAdapter();

    case "email":
      return new EmailAdapter();

    case "telegram":
      return new TelegramAdapter();

    default:
      return null;
  }
}

module.exports = obtenerAdapter;