class HabitoBuilder {
    constructor() {
        this.habito = {};
    }
  setNombre(nombre) {
    this.habito.nombre = nombre;
    return this;
  }
  setDescripcion(descripcion) {
    this.habito.descripcion = descripcion;
    return this;
  }
  setEstado(estado) {
    this.habito.estado = estado;
    return this;
  }
  setHorario(horario) {
    this.habito.horario = horario;
    return this;
  }
  setFechas(inicio, fin) {
    this.habito.fechaInicio = inicio;
    this.habito.fechaFin = fin;
    return this;
  }
  setCategoria(categoria) {
    this.habito.categoria = categoria;
    return this;
  }
  setDiasSeleccionados(dias) {
    this.habito.diasSeleccionados = dias;
    return this;
  }

  setFrecuenciaSemanal(freq) {
    this.habito.frecuenciaSemanal = freq;
    return this;
  }
  build() {
    return this.habito;
  }
}

module.exports = HabitoBuilder;
