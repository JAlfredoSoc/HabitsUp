class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modalLogin = page.getByTestId('modal-login');
    this.encabezadoModal = this.modalLogin.getByRole('heading', { name: 'Iniciar sesión' });
    this.inputCorreo = this.modalLogin.getByLabel('Correo electrónico');
    this.inputContrasena = this.modalLogin.getByLabel('Contraseña');
    this.botonSubmit = this.modalLogin.getByRole('button', { name: 'Iniciar sesión' });
    this.botonIrARegistro = this.modalLogin.getByRole('button', { name: 'Regístrate' });
    this.botonCerrar = this.modalLogin.getByRole('button', { name: 'Cerrar' });
    this.alertaError = page.getByTestId('login-alert-error');
  }

  async login(correo, contrasena) {
    await this.inputCorreo.fill(correo);
    await this.inputContrasena.fill(contrasena);
    await this.botonSubmit.click();
  }

  async cambiarAModalRegistro() {
    await this.botonIrARegistro.click();
  }
}

module.exports = { LoginPage };
