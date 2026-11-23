class HabitoFormPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modalHabito = page.getByTestId('modal-habito');
    this.inputNombre = this.modalHabito.getByLabel('Nombre del hábito *');
    this.inputDescripcion = this.modalHabito.getByLabel('Descripción *');
    this.selectCategoria = this.modalHabito.getByLabel('Categoría *');
    this.selectPeriodo = this.modalHabito.getByLabel('Periodo *');
    this.inputFrecuencia = this.modalHabito.getByLabel('Frecuencia *');
    this.inputHorario = this.modalHabito.getByLabel('Horario *');
    this.inputFechaInicio = this.modalHabito.getByLabel('Fecha inicio');
    this.inputFechaFin = this.modalHabito.getByLabel('Fecha fin');

    this.botonCrearHabito = this.modalHabito.getByRole('button', { name: 'Crear hábito' });
    this.botonGuardarCambios = this.modalHabito.getByRole('button', { name: 'Guardar cambios' });
    this.botonCancelar = this.modalHabito.getByRole('button', { name: 'Cancelar' });

    // Mensajes de error de validación en el formulario
    this.errorNombre = page.getByTestId('error-habito-nombre');
    this.errorDescripcion = page.getByTestId('error-habito-descripcion');
    this.errorCategoria = page.getByTestId('error-habito-categoria');
    this.errorPeriodo = page.getByTestId('error-habito-periodo');
    this.errorFrecuencia = page.getByTestId('error-habito-frecuencia');
    this.errorHorario = page.getByTestId('error-habito-horario');
  }

  async llenarFormularioHabito({
    nombre,
    descripcion,
    categoria,
    periodo,
    frecuencia,
    horario,
    fechaInicio,
    fechaFin,
  }) {
    if (nombre !== undefined) {
      await this.inputNombre.fill(nombre);
    }
    if (descripcion !== undefined) {
      await this.inputDescripcion.fill(descripcion);
    }
    if (categoria !== undefined) {
      await this.selectCategoria.selectOption({ label: categoria });
    }
    if (periodo !== undefined) {
      await this.selectPeriodo.selectOption(periodo);
    }
    if (frecuencia !== undefined) {
      await this.inputFrecuencia.fill(String(frecuencia));
    }
    if (horario !== undefined) {
      await this.inputHorario.fill(horario);
    }
    if (fechaInicio !== undefined) {
      await this.inputFechaInicio.fill(fechaInicio);
    }
    if (fechaFin !== undefined) {
      await this.inputFechaFin.fill(fechaFin);
    }
  }

  async crearHabito(datos) {
    await this.llenarFormularioHabito(datos);
    await this.botonCrearHabito.click();
  }

  async editarHabito(datos) {
    await this.llenarFormularioHabito(datos);
    await this.botonGuardarCambios.click();
  }

  async enviarFormularioVacio() {
    await this.botonCrearHabito.click();
  }

  async confirmarCreacionDesdeSugerencia(datosOpcionales = {}) {
    await this.llenarFormularioHabito(datosOpcionales);
    await this.botonCrearHabito.click();
  }
}

module.exports = { HabitoFormPage };
