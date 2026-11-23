const { test, expect } = require('./fixtures/testFixtures');

test.describe('Flujo Crítico 3: Seguimiento de Progreso y Catálogo de Sugerencias (CP-44 y CP-47)', () => {
  test('CP-44: Debe incrementar el progreso de un hábito desde su tarjeta y persistir tras recargar la página', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreHabito = `Entrenamiento Progreso ${Date.now()}`;
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();
    await habitoFormPage.crearHabito({
      nombre: nombreHabito,
      descripcion: 'Realizar dos sesiones de estiramiento articular al día',
      categoria: 'Salud',
      periodo: 'diario',
      frecuencia: '2',
      horario: '10:00',
    });
    const tarjeta = dashboardPage.obtenerTarjetaHabito(nombreHabito);
    const indicadorProgreso = dashboardPage.obtenerTextoProgresoDeHabito(nombreHabito);
    await expect(tarjeta).toBeVisible();
    await expect(indicadorProgreso).toHaveText('0%');

    // Act
    await dashboardPage.completarHabito(nombreHabito);

    // Assert
    await expect(indicadorProgreso).toHaveText('50%');
    await dashboardPage.recargarPanel();
    await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreHabito)).toHaveText('50%');
  });

  test('CP-47: Debe adoptar un hábito predefinido desde el catálogo de sugerencias e incorporarlo al panel', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreSugerenciaBase = 'Beber 2L de agua';
    const nombrePersonalizado = `Beber 2L de agua Adoptado ${Date.now()}`;
    await dashboardPage.irAlPanel();
    await dashboardPage.irASeccionSugerencias();
    await expect(dashboardPage.encabezadoSugerencias).toBeVisible();

    // Act
    await dashboardPage.elegirSugerencia(nombreSugerenciaBase);
    await habitoFormPage.confirmarCreacionDesdeSugerencia({
      nombre: nombrePersonalizado,
      horario: '08:30',
      periodo: 'diario',
      frecuencia: '1',
    });
    await dashboardPage.irASeccionMisHabitos();

    // Assert
    const tarjetaAdoptada = dashboardPage.obtenerTarjetaHabito(nombrePersonalizado);
    await expect(tarjetaAdoptada).toBeVisible();
    await expect(tarjetaAdoptada).toContainText('Salud');
  });
});
