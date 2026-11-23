const { test, expect } = require('../fixtures/testFixtures');

test.describe('Entregable 5: Pruebas E2E Asistidas por IA con Playwright MCP (e2e/ia/)', () => {
  test('IA-01: Debe clonar un hábito completado mediante Prototype reiniciando el progreso de la copia a 0%', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreBase = `Meditación Mindfulness IA ${Date.now()}`;
    const nombreCopiaEsperado = `${nombreBase} (copia)`;
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();
    await habitoFormPage.crearHabito({
      nombre: nombreBase,
      descripcion: 'Realizar diez minutos de atención plena antes de dormir',
      categoria: 'Bienestar',
      periodo: 'diario',
      frecuencia: '1',
      horario: '21:30',
    });
    await dashboardPage.completarHabito(nombreBase);
    await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreBase)).toHaveText('100%');

    // Act
    await dashboardPage.clonarHabito(nombreBase);

    // Assert
    const tarjetaClonada = dashboardPage.obtenerTarjetaHabito(nombreCopiaEsperado);
    const progresoClon = dashboardPage.obtenerTextoProgresoDeHabito(nombreCopiaEsperado);
    await expect(tarjetaClonada).toBeVisible();
    await expect(progresoClon).toHaveText('0%');
    await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreBase)).toHaveText('100%');
  });

  test('IA-02: Debe actualizar el nombre y teléfono desde el modal Mi Perfil y sincronizar la barra superior', async ({
    dashboardPage,
    profileModalPage,
  }) => {
    // Arrange
    const nuevoNombrePerfil = 'Jose Alfredo Maestre Editado';
    const nuevoTelefonoPerfil = '3159876543';
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalPerfil();
    await expect(profileModalPage.encabezadoModal).toBeVisible();

    // Act
    await profileModalPage.actualizarDatosPerfil({
      nombre: nuevoNombrePerfil,
      telefono: nuevoTelefonoPerfil,
    });
    await profileModalPage.cerrarModalPerfil();

    // Assert
    await expect(dashboardPage.nombreUsuarioHeader).toHaveText(nuevoNombrePerfil);
    await dashboardPage.recargarPanel();
    await expect(dashboardPage.nombreUsuarioHeader).toHaveText(nuevoNombrePerfil);
  });

  test('IA-03: Debe filtrar el catálogo de sugerencias por categoría y cerrar sesión redirigiendo al inicio', async ({
    page,
    landingPage,
    dashboardPage,
  }) => {
    // Arrange
    await dashboardPage.irAlPanel();
    await dashboardPage.irASeccionSugerencias();
    await expect(dashboardPage.encabezadoSugerencias).toBeVisible();

    // Act
    await dashboardPage.filtrarSugerenciasPorCategoria('Estudio');

    // Assert
    await expect(dashboardPage.obtenerTarjetaSugerencia('Lectura diaria')).toBeVisible();
    await expect(dashboardPage.obtenerTarjetaSugerencia('Meditación')).toHaveCount(0);

    // Act (Cierre de sesión)
    await dashboardPage.cerrarSesion();

    // Assert (Redirección y protección de sesión)
    await expect(page).toHaveURL(/\/$/);
    await expect(landingPage.tituloHero).toBeVisible();
  });
});
