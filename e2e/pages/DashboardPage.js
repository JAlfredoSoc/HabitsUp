class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.encabezadoPanel = page.getByRole('heading', { name: 'Mis hábitos' });
    this.encabezadoHabitosActivos = page.getByRole('heading', { name: 'Tus hábitos activos' });
    this.nombreUsuarioHeader = page.getByTestId('usuario-nombre-header');
    this.botonCerrarSesion = page.getByTestId('btn-cerrar-sesion');
    this.botonNuevoHabito = page.getByRole('button', { name: 'Nuevo hábito' });

    // Navegación lateral
    this.menuMisHabitos = page.getByTestId('nav-menu-habitos');
    this.menuSugerencias = page.getByTestId('nav-menu-sugerencias');
    this.menuEstadisticas = page.getByTestId('nav-menu-estadisticas');
    this.menuHistorial = page.getByTestId('nav-menu-historial');

    // Colecciones de tarjetas
    this.tarjetasHabito = page.getByTestId('tarjeta-habito');
    this.tarjetasSugerencia = page.getByTestId('tarjeta-sugerencia');
    this.encabezadoSugerencias = page.getByRole('heading', { name: 'Sugerencias para ti' });
  }

  async irAlPanel() {
    await this.page.goto('/panel-principal');
  }

  async recargarPanel() {
    await this.page.reload();
  }

  async abrirModalNuevoHabito() {
    await this.botonNuevoHabito.click();
  }

  /**
   * Selecciona una tarjeta de hábito de la lista usando filter({ hasText }), sin usar nth()
   * @param {string} nombreHabito
   */
  obtenerTarjetaHabito(nombreHabito) {
    return this.tarjetasHabito.filter({ hasText: nombreHabito });
  }

  obtenerTextoProgresoDeHabito(nombreHabito) {
    return this.obtenerTarjetaHabito(nombreHabito).getByTestId('habito-progreso-texto');
  }

  async completarHabito(nombreHabito) {
    const tarjeta = this.obtenerTarjetaHabito(nombreHabito);
    await tarjeta.getByRole('button', { name: 'Completar' }).click();
  }

  async abrirEdicionHabito(nombreHabito) {
    const tarjeta = this.obtenerTarjetaHabito(nombreHabito);
    await tarjeta.getByRole('button', { name: 'Editar' }).click();
  }

  async eliminarHabito(nombreHabito) {
    const tarjeta = this.obtenerTarjetaHabito(nombreHabito);
    await tarjeta.getByRole('button', { name: 'Eliminar' }).click();
  }

  async clonarHabito(nombreHabito) {
    const tarjeta = this.obtenerTarjetaHabito(nombreHabito);
    await tarjeta.getByRole('button', { name: 'Clonar' }).click();
  }

  async irASeccionSugerencias() {
    await this.menuSugerencias.click();
  }

  async irASeccionMisHabitos() {
    await this.menuMisHabitos.click();
  }

  /**
   * Selecciona una sugerencia de la lista usando filter({ hasText }), sin usar nth()
   * @param {string} nombreSugerencia
   */
  obtenerTarjetaSugerencia(nombreSugerencia) {
    return this.tarjetasSugerencia.filter({ hasText: nombreSugerencia });
  }

  async elegirSugerencia(nombreSugerencia) {
    const tarjetaSug = this.obtenerTarjetaSugerencia(nombreSugerencia);
    await tarjetaSug.getByRole('button', { name: 'Seleccionar' }).click();
  }

  async cerrarSesion() {
    await this.botonCerrarSesion.click();
  }
}

module.exports = { DashboardPage };
