const bcrypt = require("bcrypt");

class ValidacionesUsuario {
  static validarEmail(correo) {
    if (!correo || typeof correo !== "string") return false;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(correo.trim());
  }

  static validarPassword(contrasena) {
    if (!contrasena || typeof contrasena !== "string") return false;
    return contrasena.length >= 6;
  }

  static validarEdad(edad) {
    if (edad === null || edad === undefined || edad === "") return false;
    const num = Number(edad);
    if (isNaN(num)) return false;
    return num > 0 && num <= 120 && Number.isInteger(num);
  }

  static validarDatosRegistro(datos = {}) {
    const errores = [];

    if (!datos.nombre || typeof datos.nombre !== "string" || !datos.nombre.trim()) {
      errores.push("El nombre es requerido");
    }

    if (!this.validarEmail(datos.correo)) {
      errores.push("El formato del correo electrónico no es válido");
    }

    if (!this.validarPassword(datos.contrasena)) {
      errores.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (!this.validarEdad(datos.edad)) {
      errores.push("La edad debe ser un número entero positivo válido");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  static async hashearPassword(contrasena, saltRounds = 10) {
    if (!this.validarPassword(contrasena)) {
      throw new Error("Contraseña inválida para hashear");
    }
    return await bcrypt.hash(contrasena, saltRounds);
  }

  static async verificarPassword(contrasena, hash) {
    if (!contrasena || !hash) return false;
    return await bcrypt.compare(contrasena, hash);
  }
}

module.exports = ValidacionesUsuario;
