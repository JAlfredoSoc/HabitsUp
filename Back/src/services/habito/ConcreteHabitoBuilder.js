const HabitoBuilder = require("./HabitoBuilder");

class ConcreteHabitoBuilder extends HabitoBuilder {
  constructor() {
    super();
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
    this.habito.estado = estado || "pendiente";
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

  build() {
    return this.habito;
  }
}

module.exports = ConcreteHabitoBuilder;