class HabitoDirector {
  construirHabitoCompleto(builder, data) {
    return builder
      .setNombre(data.nombre)
      .setDescripcion(data.descripcion)
      .setEstado(data.estado)
      .setHorario(data.horario)
      .setFechas(data.fechaInicio, data.fechaFin)
      .setCategoria(data.categoria)
      .setDiasSeleccionados(data.diasSeleccionados)
      .setFrecuenciaSemanal(data.frecuenciaSemanal)
      .build();
  }
}

module.exports = HabitoDirector;