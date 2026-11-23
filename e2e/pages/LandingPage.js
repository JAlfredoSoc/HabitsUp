class LandingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.tituloHero = page.getByRole('heading', { name: 'Mejora tus hábitos' });
    this.botonIniciarSesionNav = page.getByTestId('nav-btn-login');
    this.botonRegistrarseNav = page.getByTestId('nav-btn-registro');
    this.botonComienzaAhora = page.getByRole('button', { name: 'Comienza ahora' });
  }

  async irAInicio() {
    await this.page.goto('/');
  }

  async navegarDirectoAPanel() {
    await this.page.goto('/panel-principal');
  }

  async abrirModalInicioSesion() {
    await this.botonIniciarSesionNav.click();
  }

  async abrirModalRegistro() {
    await this.botonRegistrarseNav.click();
  }

  async limpiarSesionLocal() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

module.exports = { LandingPage };
