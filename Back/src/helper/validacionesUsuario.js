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
    return num >= 18 && num <= 120 && Number.isInteger(num);
  }

  static validarTelefono(telefono) {
    if (!telefono || (typeof telefono !== "string" && typeof telefono !== "number")) return false;
    const limpio = String(telefono).trim();
    // Debe tener solo números y longitud entre 7 y 15 dígitos
    const regexTelefono = /^\d{7,15}$/;
    return regexTelefono.test(limpio);
  }

  static validarNombre(nombre) {
    if (!nombre || typeof nombre !== "string") return false;
    const limpio = nombre.trim();
    if (limpio.length < 2 || limpio.length > 60) return false;
    // Permite letras (incluye acentos, ñ), espacios, apóstrofes y guiones
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    return regexNombre.test(limpio);
  }

  static validarDatosRegistro(datos = {}) {
    const errores = [];

    if (!this.validarNombre(datos.nombre)) {
      errores.push("El nombre debe contener al menos 2 caracteres y solo letras");
    }

    if (!this.validarEmail(datos.correo)) {
      errores.push("El formato del correo electrónico no es válido");
    }

    if (!this.validarPassword(datos.contrasena)) {
      errores.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (!this.validarEdad(datos.edad)) {
      errores.push("La edad debe ser un número entero entre 18 y 120 años");
    }

    if (!this.validarTelefono(datos.telefono)) {
      errores.push("El teléfono debe contener únicamente dígitos numéricos (entre 7 y 15 dígitos)");
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  static validarDatosEdicion(datos = {}) {
    const errores = [];

    if (datos.nombre !== undefined && !this.validarNombre(datos.nombre)) {
      errores.push("El nombre debe contener al menos 2 caracteres y solo letras");
    }

    if (datos.correo !== undefined && !this.validarEmail(datos.correo)) {
      errores.push("El formato del correo electrónico no es válido");
    }

    if (datos.contrasena !== undefined && datos.contrasena !== "" && !this.validarPassword(datos.contrasena)) {
      errores.push("La nueva contraseña debe tener al menos 6 caracteres");
    }

    if (datos.edad !== undefined && !this.validarEdad(datos.edad)) {
      errores.push("La edad debe ser un número entero entre 18 y 120 años");
    }

    if (datos.telefono !== undefined && !this.validarTelefono(datos.telefono)) {
      errores.push("El teléfono debe contener únicamente dígitos numéricos (entre 7 y 15 dígitos)");
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
