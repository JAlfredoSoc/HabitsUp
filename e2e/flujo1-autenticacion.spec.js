const { test, expect } = require('./fixtures/testFixtures');

// Este bloque prueba registro, login y guardia de rutas desde un contexto sin sesión activa
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Flujo Crítico 1: Registro, Inicio de Sesión y Seguridad SPA (CP-37 a CP-41)', () => {
  test('CP-37 (Negativo): Debe mostrar errores de validación y bloquear el registro ante datos inválidos', async ({
    landingPage,
    registerPage,
  }) => {
    // Arrange
    await landingPage.irAInicio();
    await landingPage.abrirModalRegistro();

    // Act
    await registerPage.registrarUsuario({
      nombre: 'A',
      correo: 'correo-invalido',
      contrasena: '123',
      edad: '15',
      telefono: '123',
    });

    // Assert
    await expect(registerPage.alertaError).toBeVisible();
    await expect(registerPage.alertaError).toContainText(
      'El nombre debe tener al menos 2 caracteres'
    );
    await expect(registerPage.encabezadoModal).toBeVisible();
  });

  test('CP-38 y CP-39: Debe registrar un nuevo usuario exitosamente e iniciar sesión accediendo al panel principal', async ({
    page,
    landingPage,
    registerPage,
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    const correoUnico = `usuario.flujo1.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.test`;
    const nuevoUsuario = {
      nombre: 'Ismael Peñaloza Prueba',
      correo: correoUnico,
      contrasena: 'ClaveSegura2026!',
      edad: '24',
      telefono: '3015556677',
    };
    await landingPage.irAInicio();

    // Act
    await landingPage.abrirModalRegistro();
    await registerPage.registrarUsuario(nuevoUsuario);
    await expect(registerPage.alertaExito).toBeVisible();
    await registerPage.cambiarAModalLogin();
    await loginPage.login(nuevoUsuario.correo, nuevoUsuario.contrasena);

    // Assert
    await expect(page).toHaveURL(/\/panel-principal/);
    await expect(dashboardPage.encabezadoPanel).toBeVisible();
    await expect(dashboardPage.nombreUsuarioHeader).toHaveText(nuevoUsuario.nombre);
  });

  test('CP-40 (Negativo): Debe rechazar el inicio de sesión cuando la contraseña es incorrecta', async ({
    page,
    landingPage,
    registerPage,
    loginPage,
  }) => {
    // Arrange
    const correoLoginNeg = `usuario.neg.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.test`;
    await landingPage.irAInicio();
    await landingPage.abrirModalRegistro();
    await registerPage.registrarUsuario({
      nombre: 'Usuario Prueba Negativa',
      correo: correoLoginNeg,
      contrasena: 'PasswordCorrecta123!',
      edad: '25',
      telefono: '3008889900',
    });
    await expect(registerPage.alertaExito).toBeVisible();
    await registerPage.cambiarAModalLogin();

    // Act
    await loginPage.login(correoLoginNeg, 'PasswordIncorrecta999!');

    // Assert
    await expect(loginPage.alertaError).toBeVisible();
    await expect(loginPage.alertaError).toContainText('Contraseña incorrecta');
    await expect(page).toHaveURL(/\/$/);
  });

  test('CP-41 (Negativo): Debe bloquear el acceso directo a /panel-principal y redirigir al inicio si no hay sesión', async ({
    page,
    landingPage,
  }) => {
    // Arrange
    await landingPage.irAInicio();
    await landingPage.limpiarSesionLocal();

    // Act
    await landingPage.navegarDirectoAPanel();

    // Assert
    await expect(page).toHaveURL(/\/$/);
    await expect(landingPage.tituloHero).toBeVisible();
  });
});
