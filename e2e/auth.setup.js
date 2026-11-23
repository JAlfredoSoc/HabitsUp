const path = require('node:path');
const fs = require('node:fs');
const { test, expect } = require('./fixtures/testFixtures');

const authFile = path.join(__dirname, '.auth/user.json');

test('Setup de autenticación reutilizable con storageState', async ({
  page,
  landingPage,
  registerPage,
  loginPage,
  dashboardPage,
}) => {
  // Arrange
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  const correoSetup = `e2e.setup.${Date.now()}@example.test`;
  const datosUsuario = {
    nombre: 'Usuario Setup Automatizado',
    correo: correoSetup,
    contrasena: 'PasswordE2E123!',
    edad: '26',
    telefono: '3001234567',
  };

  // Act
  await landingPage.irAInicio();
  await landingPage.abrirModalRegistro();
  await registerPage.registrarUsuario(datosUsuario);
  await expect(registerPage.alertaExito).toBeVisible();
  await registerPage.cambiarAModalLogin();
  await loginPage.login(datosUsuario.correo, datosUsuario.contrasena);

  // Assert
  await expect(page).toHaveURL(/\/panel-principal/);
  await expect(dashboardPage.encabezadoPanel).toBeVisible();
  await expect(dashboardPage.nombreUsuarioHeader).toHaveText(datosUsuario.nombre);

  await page.context().storageState({ path: authFile });
});
