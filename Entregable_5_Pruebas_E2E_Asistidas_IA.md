# Entregable 5: Pruebas E2E asistidas por IA con Playwright MCP (RAA4)
**Proyecto:** Habits UP  
**Asignatura:** Ingeniería de Pruebas Automatizadas  
**Institución:** Universidad Popular del Cesar (UPC)  

---

## 1. Configuración de Playwright MCP

Para integrar el servidor **Playwright MCP (Model Context Protocol)** en el entorno de desarrollo (VS Code / Claude Code / Claude Desktop), se creó el archivo de configuración [.vscode/mcp.json](file:///c:/Users/JoseL/OneDrive/Escritorio/HabitsUp/.vscode/mcp.json) en el repositorio del proyecto:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Con esta configuración, el asistente de IA inspecciona el árbol de accesibilidad del DOM de **Habits UP** en `http://localhost:5173` y genera escenarios de prueba End-to-End sobre flujos funcionales que **no estaban cubiertos en el Entregable 4**:
1. **Prueba IA-01:** Clonación de un hábito completado (`100%`) mediante el patrón *Prototype* y verificación de que la copia (`(copia)`) inicia con progreso reiniciado en `0%`.
2. **Prueba IA-02:** Edición y actualización de los datos del perfil de usuario desde el modal **Mi Perfil** (`ModalPerfil`) y verificación de la sincronización reactiva del nombre en el encabezado superior (`BarraSuperiorPanel`).
3. **Prueba IA-03:** Filtrado dinámico del catálogo de sugerencias por categoría (`Estudio`) en `SeccionSugerencias` y flujo de cierre de sesión (`Logout`) con redirección a la portada (`/`).

---

## 2. Documentación de Prompts, Código Generado vs. Código Final Revisado

### Escenario IA-01: Clonación de Hábito con Patrón Prototype y Reinicio de Progreso

#### Prompt estructurado utilizado
> **Rol:** Actúa como un Ingeniero Senior de Automatización QA experto en Playwright con JavaScript y el patrón Page Object Model (POM).  
> **Contexto:** Estamos probando la aplicación web **Habits UP** (`http://localhost:5173`). El proyecto utiliza Playwright con sesión autenticada mediante `storageState` (`e2e/.auth/user.json`) e inyección de Page Objects mediante fixtures en `e2e/fixtures/testFixtures.js` (`dashboardPage`, `habitoFormPage`). En el panel principal (`/panel-principal`), cada tarjeta de hábito (`data-testid="tarjeta-habito"`) tiene los botones `"Completar"`, `"Editar"`, `"Clonar"` y `"Eliminar"`, además del indicador de progreso (`data-testid="habito-progreso-texto"`). Cuando se clona un hábito, el backend aplica el patrón *Prototype* creando un nuevo hábito con el sufijo `" (copia)"` y reiniciando su progreso a `0%`.  
> **Tarea:** Genera una prueba E2E que cree un hábito diario con frecuencia `1`, lo marque como completado (`100%`), ejecute la acción de clonar sobre esa tarjeta y verifique que aparece la nueva tarjeta con sufijo `" (copia)"` y progreso en `0%`, manteniendo el hábito original en `100%`.  
> **Restricciones:**  
> 1. Marca explícitamente los bloques `// Arrange`, `// Act`, `// Assert`.  
> 2. Prohibido usar `waitForTimeout`, selectores CSS, XPath o `.nth()`.  
> 3. Usa únicamente aserciones web-first (`await expect(locator)...`) y selección en listas con `.filter({ hasText })`.  
> **Formato de salida:** Bloque de código JavaScript compatible con `@playwright/test`.

#### Código generado por la IA (sin editar)
```javascript
const { test, expect } = require('@playwright/test');

test('IA-01: Clonar habito completado y verificar progreso en 0%', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/panel-principal');
  await page.locator('button:has-text("Nuevo hábito")').click();
  await page.locator('input[name="nombre"]').fill('Meditación Mindfulness IA');
  await page.locator('textarea[name="descripcion"]').fill('Realizar diez minutos de atención plena');
  await page.locator('select[name="categoria"]').selectOption({ index: 1 });
  await page.locator('select[name="periodo"]').selectOption('diario');
  await page.locator('input[name="frecuencia"]').fill('1');
  await page.locator('input[name="horario"]').fill('21:30');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  const cardOriginal = page.locator('.tarjeta-habito').first();
  await cardOriginal.locator('button:has-text("Completar")').click();
  await page.waitForTimeout(1000);

  // Act
  await cardOriginal.locator('button:has-text("Clonar")').click();
  await page.waitForTimeout(1500);

  // Assert
  const cardCopia = page.locator('.tarjeta-habito').nth(1);
  await expect(cardCopia).toContainText('Meditación Mindfulness IA (copia)');
  await expect(cardCopia).toContainText('0%');
});
```

#### Código final revisado y adaptado al POM (`e2e/ia/pruebas-asistidas-ia.spec.js`)
```javascript
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
```

---

### Escenario IA-02: Edición de Perfil de Usuario y Sincronización Reactiva del Encabezado

#### Prompt estructurado utilizado
> **Rol:** Actúa como un Ingeniero de Pruebas Automatizadas especialista en Playwright y arquitectura Page Object Model.  
> **Contexto:** En la aplicación **Habits UP**, el encabezado superior (`BarraSuperiorPanel.jsx`) muestra el nombre del usuario autenticado en un elemento con `data-testid="usuario-nombre-header"`. Al hacer clic sobre ese nombre, se abre el modal **Mi Perfil** (`ModalPerfil.jsx`, `data-testid="modal-perfil"`), cuyos campos están inicialmente deshabilitados hasta hacer clic en el botón `"Editar Perfil"`. Tras modificar `"Nombre"` y `"Teléfono"` y pulsar `"Guardar Cambios"`, la aplicación actualiza el backend (`PUT /EditarUsuario/:id`), sincroniza `localStorage` y dispara el evento `usuarioActualizado`.  
> **Tarea:** Crea una prueba E2E que abra el modal de perfil, active la edición, actualice el nombre y teléfono del usuario, cierre el modal y verifique que el nuevo nombre se muestra inmediatamente en la barra superior y persiste tras recargar la página.  
> **Restricciones:**  
> 1. Estructura `// Arrange`, `// Act`, `// Assert` obligatoria.  
> 2. Todos los locators deben declararse exclusivamente en el constructor de un Page Object (`ProfileModalPage.js` y `DashboardPage.js`); el archivo `.spec.js` no puede tener locators directos.  
> 3. Prohibido `waitForTimeout`, selectores CSS o XPath.  
> **Formato de salida:** Clase `ProfileModalPage` y test de Playwright inyectado con fixtures.

#### Código generado por la IA (sin editar)
```javascript
const { test, expect } = require('@playwright/test');

test('IA-02: Actualizar perfil de usuario', async ({ page }) => {
  // Arrange
  await page.goto('/panel-principal');
  await page.locator('[data-testid="usuario-nombre-header"]').click();
  await page.waitForTimeout(500);

  // Act
  await page.locator('button:has-text("Editar Perfil")').click();
  await page.locator('input[name="nombre"]').fill('Jose Alfredo Maestre 2026');
  await page.locator('input[name="telefono"]').fill('3159876543');
  await page.locator('button:has-text("Guardar Cambios")').click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Cerrar")').click();

  // Assert
  const headerName = await page.locator('[data-testid="usuario-nombre-header"]').textContent();
  expect(headerName).toBe('Jose Alfredo Maestre 2026');
});
```

#### Código final revisado y adaptado al POM (`e2e/ia/pruebas-asistidas-ia.spec.js`)
```javascript
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
```

---

### Escenario IA-03: Filtrado de Sugerencias por Categoría y Cierre de Sesión Seguro

#### Prompt estructurado utilizado
> **Rol:** Actúa como un Ingeniero QA Senior experto en Playwright E2E.  
> **Contexto:** En **Habits UP** (`/panel-principal`), el menú lateral permite navegar a la vista `"Sugerencias"` (`data-testid="nav-menu-sugerencias"`), donde se cargan las sugerencias semilla (`"Beber 2L de agua"` en `Salud`, `"Lectura diaria"` en `Estudio`, `"Meditación"` en `Bienestar`) y un selector de filtro por categoría (`data-testid="select-filtro-categoria-sugerencias"`). Además, la barra superior cuenta con el botón de cierre de sesión (`data-testid="btn-cerrar-sesion"`).  
> **Tarea:** Genera una prueba E2E que navegue a `"Sugerencias"`, filtre por la categoría `"Estudio"`, verifique que la tarjeta `"Lectura diaria"` sea visible y que `"Meditación"` no aparezca, y finalmente ejecute el cierre de sesión comprobando la redirección a `/`.  
> **Restricciones:**  
> 1. Usa comentarios `// Arrange`, `// Act`, `// Assert`.  
> 2. Cero locators directos en el `.spec.js`, cero `waitForTimeout`, cero `.nth()` y cero selectores CSS/XPath.  
> **Formato de salida:** Test en JavaScript usando fixtures `dashboardPage` y `landingPage`.

#### Código generado por la IA (sin editar)
```javascript
const { test, expect } = require('@playwright/test');

test('IA-03: Filtrar sugerencias y cerrar sesion', async ({ page }) => {
  // Arrange
  await page.goto('/panel-principal');
  await page.locator('.menu-lateral-btn').nth(3).click();
  await page.waitForTimeout(1000);

  // Act
  await page.locator('select.form-select').selectOption({ label: 'Estudio' });
  await page.waitForTimeout(500);

  // Assert
  await expect(page.locator('.tarjeta-habito').first()).toContainText('Lectura diaria');

  // Act - Logout
  await page.locator('button[title="Cerrar sesión"]').click();
  await expect(page).toHaveURL('http://localhost:5173/');
});
```

#### Código final revisado y adaptado al POM (`e2e/ia/pruebas-asistidas-ia.spec.js`)
```javascript
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
```

---

## 3. Tabla de Revisión Crítica (Human-in-the-Loop)

| Prueba | ¿Qué hizo bien la IA? | ¿Qué se tuvo que corregir? (Hallazgos técnicos) | ¿Por qué fue necesaria la corrección? (Justificación ingenieril) |
|---|---|---|---|
| **IA-01: Clonación de hábito con Prototype** | - Identificó correctamente la secuencia funcional del caso: creación → completar progreso → clonar → verificar sufijo `(copia)` y reinicio a `0%`.<br>- Estructuró los bloques `Arrange`, `Act`, `Assert`. | 1. **Esperas fijas (`waitForTimeout`):** La IA insertó tres llamadas a `page.waitForTimeout(2000/1000/1500)`.<br>2. **Posición fija en listas (`.first()` y `.nth(1)`):** Asumió que el hábito original era `.first()` y la copia `.nth(1)`.<br>3. **Violación de Strict Mode por subcadena:** Al clonar, `nombreBase` es subcadena de `nombreBase + " (copia)"`, por lo que un filtro simple resuelve a 2 tarjetas.<br>4. **Locators CSS en el `.spec`:** Usó `input[name="nombre"]` y `.tarjeta-habito` directo en el test. | 1. `waitForTimeout` introduce lentitud e inestabilidad (*flakiness*) y está prohibido por el estándar del proyecto.<br>2. En una suite con múltiples pruebas, `.first()` y `.nth(1)` apuntan a hábitos creados por tests anteriores.<br>3. Se combinó `.filter({ hasText: nombreHabito })` con coincidencia exacta del encabezado `getByRole('heading', { name: nombreHabito, exact: true })` en `DashboardPage` para distinguir sin ambigüedad el original de su `(copia)`.<br>4. Se encapsularon todos los locators en `DashboardPage` y `HabitoFormPage`. |
| **IA-02: Edición de perfil en `ModalPerfil`** | - Reconoció que los campos del modal están bloqueados inicialmente y que es obligatorio pulsar `"Editar Perfil"` antes de llenar los inputs.<br>- Identificó el `data-testid="usuario-nombre-header"`. | 1. **Dato inventado inválido para la regla del dominio:** La IA usó el nombre `'Jose Alfredo Maestre 2026'` con números, pero `ModalPerfil.jsx` filtra dígitos numéricos con regex (`/[^a-zA-Z...]/g`), haciendo que el texto real guardado fuera `'Jose Alfredo Maestre '` y fallara la aserción.<br>2. **Aserción débil no web-first:** Usó `const headerName = await locator.textContent(); expect(headerName).toBe(...)` en lugar de `await expect(locator).toHaveText(...)`.<br>3. **Violación de POM:** No creó `ProfileModalPage`. | 1. Al igual que en el formulario de registro, el campo `nombre` solo acepta letras; se corrigió a `'Jose Alfredo Maestre Editado'`.<br>2. `textContent()` evalúa instantáneamente sin reintento automático (*auto-waiting*); cambiarlo a `await expect(dashboardPage.nombreUsuarioHeader).toHaveText(...)` asegura resiliencia web-first.<br>3. Se creó [ProfileModalPage.js](file:///c:/Users/JoseL/OneDrive/Escritorio/HabitsUp/e2e/pages/ProfileModalPage.js) y se inyectó en [testFixtures.js](file:///c:/Users/JoseL/OneDrive/Escritorio/HabitsUp/e2e/fixtures/testFixtures.js). |
| **IA-03: Filtro de sugerencias y Logout** | - Combinó acertadamente la validación del filtro de categorías con el flujo de cierre de sesión.<br>- Usó `{ label: 'Estudio' }` en `selectOption`. | 1. **Uso de `.nth(3)` y CSS frágil:** Para ir a `"Sugerencias"` usó `page.locator('.menu-lateral-btn').nth(3)` y `select.form-select`.<br>2. **Aserción incompleta del filtro:** Solo verificó que `'Lectura diaria'` apareciera con `.first()`, pero no verificó que las sugerencias de otras categorías (`'Meditación'`) desaparecieran (`toHaveCount(0)`). | 1. Si cambia el orden del menú lateral, `.nth(3)` se rompe silenciosamente; se reemplazó por `dashboardPage.irASeccionSugerencias()` basado en `getByTestId('nav-menu-sugerencias')`.<br>2. Para demostrar que un filtro realmente filtra, es indispensable una aserción positiva (`toBeVisible()` sobre la categoría elegida) y una aserción de exclusión (`toHaveCount(0)` sobre una tarjeta de otra categoría). |

---

## 4. Reflexión: ¿Cuándo conviene usar la IA en pruebas E2E?

El uso de asistentes de IA conectados mediante **Playwright MCP** acelera significativamente el **andamiaje inicial (*scaffolding*)** de las pruebas: permite explorar el DOM vivo, identificar flujos candidatos que aún no tienen cobertura (como la clonación con *Prototype* o la sincronización del perfil) y generar borradores estructurados en segundos. Sin embargo, la experiencia en este entregable demuestra que **la IA no reemplaza el criterio del ingeniero de pruebas**: tiende por defecto a generar código acoplado (locators CSS dentro de los `.spec`), recurrir a índices posicionales frágiles (`.nth()`, `.first()`), insertar esperas fijas (`waitForTimeout`) y desconocer reglas específicas de sanitización de inputs (como el bloqueo de números en el campo `nombre`). Por ello, el flujo óptimo es **híbrido (*Human-in-the-Loop*)**: usar la IA para acelerar la exploración y generación base, y aplicar una revisión crítica humana para adaptar el código al **Page Object Model**, garantizar aserciones *web-first* e integrar datos dinámicos idempotentes.
