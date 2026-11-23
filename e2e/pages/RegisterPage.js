class RegisterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modalRegistro = page.getByTestId('modal-registro');
    this.encabezadoModal = this.modalRegistro.getByRole('heading', { name: 'Registrarse' });
    this.inputNombre = this.modalRegistro.getByLabel(/Nombre/i);
    this.inputCorreo = this.modalRegistro.getByLabel(/Correo electrónico/i);
    this.inputContrasena = this.modalRegistro.getByLabel(/Contraseña/i);
    this.inputEdad = this.modalRegistro.getByLabel(/Edad/i);
    this.inputTelefono = this.modalRegistro.getByLabel(/Teléfono/i);
    this.botonSubmit = this.modalRegistro.getByRole('button', { name: 'Registrarse' });
    this.botonIrALogin = this.modalRegistro.getByRole('button', { name: 'Iniciar sesión' });
    this.botonCerrar = this.modalRegistro.getByRole('button', { name: 'Cerrar' });
    this.alertaError = page.getByTestId('registro-alert-error');
    this.alertaExito = page.getByTestId('registro-alert-exito');
  }

  async llenarFormulario({ nombre, correo, contrasena, edad, telefono }) {
    if (nombre !== undefined) await this.inputNombre.fill(nombre);
    if (correo !== undefined) await this.inputCorreo.fill(correo);
    if (contrasena !== undefined) await this.inputContrasena.fill(contrasena);
    if (edad !== undefined) await this.inputEdad.fill(String(edad));
    if (telefono !== undefined) await this.inputTelefono.fill(String(telefono));
  }

  async enviarFormulario() {
    await this.botonSubmit.click();
  }

  async registrarUsuario(datos) {
    await this.llenarFormulario(datos);
    await this.enviarFormulario();
  }

  async cambiarAModalLogin() {
    await this.botonIrALogin.click();
  }
}

module.exports = { RegisterPage };
