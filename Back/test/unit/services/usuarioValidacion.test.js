const { expect } = require("chai");
const ValidacionesUsuario = require("../../../src/helper/validacionesUsuario");
const bcrypt = require("bcrypt");

describe("Módulo de Validación y Seguridad de Usuario (CP-07 a CP-11)", () => {
  describe("Validación de Formato de Correo y Credenciales", () => {
    // CP-07: Formato de correo inválido
    it("CP-07: Debe rechazar el registro cuando el correo electrónico no tiene formato válido", () => {
      // Arrange
      const emailInvalido = "usuario-sin-arroba-ni-dominio";

      // Act
      const esValido = ValidacionesUsuario.validarEmail(emailInvalido);
      const resultado = ValidacionesUsuario.validarDatosRegistro({
        nombre: "Test User",
        correo: emailInvalido,
        contrasena: "123456",
        edad: "25",
      });

      // Assert
      expect(esValido).to.be.false;
      expect(resultado.valido).to.be.false;
      expect(resultado.errores).to.include(
        "El formato del correo electrónico no es válido"
      );
    });

    // CP-08: Contraseña menor al límite (< 6 caracteres)
    it("CP-08: Debe rechazar contraseñas que no alcancen la longitud mínima de 6 caracteres", () => {
      // Arrange
      const passwordCorta = "12345"; // 5 caracteres (valor límite - 1)

      // Act
      const esValida = ValidacionesUsuario.validarPassword(passwordCorta);
      const resultado = ValidacionesUsuario.validarDatosRegistro({
        nombre: "Test User",
        correo: "usuario@example.test",
        contrasena: passwordCorta,
        edad: "25",
      });

      // Assert
      expect(esValida).to.be.false;
      expect(resultado.valido).to.be.false;
      expect(resultado.errores).to.include(
        "La contraseña debe tener al menos 6 caracteres"
      );
    });

    // CP-09: Contraseña en el valor límite exacto (6 caracteres)
    it("CP-09: Debe aceptar contraseñas en el límite inferior exacto de 6 caracteres", () => {
      // Arrange
      const passwordLimite = "Abc123"; // 6 caracteres exactos

      // Act
      const esValida = ValidacionesUsuario.validarPassword(passwordLimite);

      // Assert
      expect(esValida).to.be.true;
    });

    // CP-10: Validación de edad negativa o no numérica
    it("CP-10: Debe rechazar valores de edad negativos, nulos o no numéricos", () => {
      // Arrange
      const edadNegativa = -1;
      const edadTexto = "veinte";
      const edadValida = 25;

      // Act
      const resNegativo = ValidacionesUsuario.validarEdad(edadNegativa);
      const resTexto = ValidacionesUsuario.validarEdad(edadTexto);
      const resValido = ValidacionesUsuario.validarEdad(edadValida);

      // Assert
      expect(resNegativo).to.be.false;
      expect(resTexto).to.be.false;
      expect(resValido).to.be.true;
    });
  });

  describe("Seguridad y Hashing de Contraseñas con bcrypt", () => {
    // CP-11: Cifrado y verificación de hash
    it("CP-11: Debe generar un hash seguro diferente al texto plano y verificar la autenticación correctamente", async () => {
      // Arrange
      const passwordPlana = "MiClaveSegura2026!";

      // Act
      const hash = await ValidacionesUsuario.hashearPassword(passwordPlana);
      const coincide = await ValidacionesUsuario.verificarPassword(
        passwordPlana,
        hash
      );
      const noCoincide = await ValidacionesUsuario.verificarPassword(
        "OtraClaveErronea",
        hash
      );

      // Assert
      expect(hash).to.not.equal(passwordPlana);
      expect(hash).to.be.a("string");
      expect(hash.startsWith("$2b$") || hash.startsWith("$2a$")).to.be.true;
      expect(coincide).to.be.true;
      expect(noCoincide).to.be.false;
    });
  });
});
