const { test, expect } = require('./fixtures/testFixtures');

const CASOS_HABITOS_DDT = [
  {
    caso: 'DDT-E2E-01 (Diario / Salud)',
    nombre: 'Hidratación Matutina DDT',
    descripcion: 'Tomar dos vasos de agua mineral al iniciar la mañana',
    categoria: 'Salud',
    periodo: 'diario',
    frecuencia: '2',
    horario: '07:00',
  },
  {
    caso: 'DDT-E2E-02 (Semanal / Estudio)',
    nombre: 'Repaso de Algoritmos DDT',
    descripcion: 'Resolver ejercicios prácticos de estructuras de datos',
    categoria: 'Estudio',
    periodo: 'semanal',
    frecuencia: '4',
    horario: '18:30',
  },
  {
    caso: 'DDT-E2E-03 (Mensual / Productividad)',
    nombre: 'Planificación Mensual DDT',
    descripcion: 'Organizar el tablero de objetivos y entregables del mes',
    categoria: 'Productividad',
    periodo: 'mensual',
    frecuencia: '1',
    horario: '09:00',
  },
];

test.describe('Flujo Crítico 2: Gestión CRUD de Hábitos y Data Driven Testing (CP-42, CP-43, CP-45, CP-46)', () => {
  test('CP-42: Debe crear un nuevo hábito desde el formulario del panel y mostrar su tarjeta activa', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreHabito = `Lectura Técnica ${Date.now()}`;
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();

    // Act
    await habitoFormPage.crearHabito({
      nombre: nombreHabito,
      descripcion: 'Leer 25 páginas de arquitectura de software limpia',
      categoria: 'Estudio',
      periodo: 'diario',
      frecuencia: '1',
      horario: '20:00',
    });

    // Assert
    const tarjetaCreada = dashboardPage.obtenerTarjetaHabito(nombreHabito);
    await expect(tarjetaCreada).toBeVisible();
    await expect(tarjetaCreada).toContainText('Estudio');
    await expect(tarjetaCreada).toContainText('0%');
  });

  test('CP-43 (Negativo): Debe mostrar mensajes de validación cuando se intenta guardar un hábito con campos vacíos', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();

    // Act
    await habitoFormPage.enviarFormularioVacio();

    // Assert
    await expect(habitoFormPage.errorNombre).toBeVisible();
    await expect(habitoFormPage.errorDescripcion).toBeVisible();
    await expect(habitoFormPage.errorCategoria).toBeVisible();
    await expect(habitoFormPage.errorPeriodo).toBeVisible();
    await expect(habitoFormPage.errorFrecuencia).toBeVisible();
    await expect(habitoFormPage.errorHorario).toBeVisible();
  });

  for (const datosCaso of CASOS_HABITOS_DDT) {
    test(`CP-42 (Data Driven - ${datosCaso.caso}): Debe crear y listar el hábito parametrizado "${datosCaso.nombre}"`, async ({
      dashboardPage,
      habitoFormPage,
    }) => {
      // Arrange
      const nombreUnico = `${datosCaso.nombre} ${Date.now()}`;
      await dashboardPage.irAlPanel();
      await dashboardPage.abrirModalNuevoHabito();

      // Act
      await habitoFormPage.crearHabito({
        ...datosCaso,
        nombre: nombreUnico,
      });

      // Assert
      const tarjeta = dashboardPage.obtenerTarjetaHabito(nombreUnico);
      await expect(tarjeta).toBeVisible();
      await expect(tarjeta).toContainText(datosCaso.categoria);
      await expect(tarjeta).toContainText(datosCaso.periodo);
    });
  }

  test('CP-45: Debe editar el nombre y descripción de un hábito existente y reflejar los cambios en la tarjeta', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreOriginal = `Hábito Para Editar ${Date.now()}`;
    const nombreEditado = `Hábito Editado Exitosamente ${Date.now()}`;
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();
    await habitoFormPage.crearHabito({
      nombre: nombreOriginal,
      descripcion: 'Descripción inicial antes de la edición del hábito',
      categoria: 'Bienestar',
      periodo: 'diario',
      frecuencia: '1',
      horario: '06:30',
    });
    await expect(dashboardPage.obtenerTarjetaHabito(nombreOriginal)).toBeVisible();

    // Act
    await dashboardPage.abrirEdicionHabito(nombreOriginal);
    await habitoFormPage.editarHabito({
      nombre: nombreEditado,
      descripcion: 'Descripción actualizada durante la prueba E2E',
    });

    // Assert
    const tarjetaActualizada = dashboardPage.obtenerTarjetaHabito(nombreEditado);
    await expect(tarjetaActualizada).toBeVisible();
    await expect(tarjetaActualizada).toContainText(
      'Descripción actualizada durante la prueba E2E'
    );
  });

  test('CP-46: Debe eliminar un hábito del panel y verificar que no reaparece tras recargar la página', async ({
    dashboardPage,
    habitoFormPage,
  }) => {
    // Arrange
    const nombreAEliminar = `Hábito Temporal Eliminar ${Date.now()}`;
    await dashboardPage.irAlPanel();
    await dashboardPage.abrirModalNuevoHabito();
    await habitoFormPage.crearHabito({
      nombre: nombreAEliminar,
      descripcion: 'Este hábito será eliminado inmediatamente en la prueba',
      categoria: 'Trabajo',
      periodo: 'diario',
      frecuencia: '1',
      horario: '15:00',
    });
    const tarjeta = dashboardPage.obtenerTarjetaHabito(nombreAEliminar);
    await expect(tarjeta).toBeVisible();

    // Act
    await dashboardPage.eliminarHabito(nombreAEliminar);

    // Assert
    await expect(tarjeta).toHaveCount(0);
    await dashboardPage.recargarPanel();
    await expect(dashboardPage.encabezadoHabitosActivos).toBeVisible();
    await expect(dashboardPage.obtenerTarjetaHabito(nombreAEliminar)).toHaveCount(0);
  });
});
