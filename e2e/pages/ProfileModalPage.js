class ProfileModalPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modalPerfil = page.getByTestId('modal-perfil');
    this.encabezadoModal = this.modalPerfil.getByRole('heading', { name: 'Mi Perfil' });
    this.inputNombre = this.modalPerfil.getByLabel('Nombre');
    this.inputCorreo = this.modalPerfil.getByLabel('Correo electrónico');
    this.inputEdad = this.modalPerfil.getByLabel('Edad');
    this.inputTelefono = this.modalPerfil.getByLabel('Teléfono');
    this.botonEditarPerfil = this.modalPerfil.getByRole('button', { name: 'Editar Perfil' });
    this.botonGuardarCambios = this.modalPerfil.getByRole('button', { name: 'Guardar Cambios' });
    this.botonCancelar = this.modalPerfil.getByRole('button', { name: 'Cancelar' });
    this.botonCerrar = this.modalPerfil.getByRole('button', { name: 'Cerrar', exact: true });
  }

  async activarModoEdicion() {
    await this.botonEditarPerfil.click();
  }

  async actualizarDatosPerfil({ nombre, edad, telefono }) {
    await this.activarModoEdicion();
    if (nombre !== undefined) {
      await this.inputNombre.fill(nombre);
    }
    if (edad !== undefined) {
      await this.inputEdad.fill(String(edad));
    }
    if (telefono !== undefined) {
      await this.inputTelefono.fill(String(telefono));
    }
    await this.botonGuardarCambios.click();
  }

  async cerrarModalPerfil() {
    await this.botonCerrar.click();
  }
}

module.exports = { ProfileModalPage };
