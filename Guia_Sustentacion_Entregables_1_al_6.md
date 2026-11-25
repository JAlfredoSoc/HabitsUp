# Guía de Sustentación y Verificación — Entregables 1 al 6 (Habits UP)

**Proyecto:** Habits UP — Ingeniería de Pruebas Automatizadas (UPC)  
**Integrantes:** Jose Alfredo Maestre Manjarrez · Ismael Jose Peñaloza Ortiz  
**Docente:** Ing. Esp. Amilkar Hernandez  

---

## Preparación Inicial (si clonas el repo desde cero)
Desde la carpeta raíz `c:\Users\JoseL\OneDrive\Escritorio\HabitsUp` en PowerShell:
```powershell
npm.cmd install
npm.cmd --prefix Back install
npm.cmd --prefix Front install
npx.cmd playwright install chromium firefox
```

---

## Entregable 1 · Plan de Pruebas y Diseño de Casos (RAA1)

### ¿Qué hicimos?
- Redactamos el plan maestro en `Plan_Pruebas_Habits_UP.md` con:
  - Descripción de **Habits UP**, arquitectura cliente-servidor (React 19 + Vite 8 → Express 5 + Node.js 20 → Mongoose 8 + MongoDB) y stack de pruebas.
  - Roles de calidad del equipo y participación en el SDLC.
  - Estrategia basada en la **Pirámide de Pruebas**, tipos de prueba (funcional, humo, regresión, negativa, contrato, DDT, rendimiento, accesibilidad), criterios de entrada/salida y técnicas formales (PE, AVL, transición de estados y casos de uso).
  - Configuración de entornos, datos semilla (`6` categorías y `3` sugerencias) y política de limpieza sobre `habitsUp_Test`.
  - **Matriz de 47 casos de prueba** (`CP-01` a `CP-47`), muy por encima del mínimo de 20.

### ¿Cómo probar / verificar que está correcto?
Este entregable es documental; se verifica abriendo el archivo y comprobando su estructura y la matriz de casos:
```powershell
# Ver resumen de los 47 casos diseñados en el Plan de Pruebas
Select-String -Path .\Plan_Pruebas_Habits_UP.md -Pattern "\*\*CP-\d+\*\*" | Measure-Object
```
- **Archivo a mostrar al docente:** `Plan_Pruebas_Habits_UP.md` (abrir en VS Code con `Ctrl + Shift + V` para vista previa).
- **Resultado esperado:** El comando confirma la presencia de los casos `CP-01` a `CP-47` organizados en Unitarias, Integración/API y E2E.

---

## Entregable 2 · Pruebas Unitarias, Mocking, TDD y Cobertura (RAA2)

### ¿Qué hicimos?
- Configuramos **Mocha 12 + Chai 6 + Sinon 22 + c8 12** en `Back/package.json`.
- Implementamos **16 pruebas unitarias** (mínimo exigido: 15) sobre **3 módulos reales de negocio** con comentarios `// Arrange`, `// Act`, `// Assert`, hooks (`afterEach(() => sinon.restore())`), casos felices, casos límite y casos negativos:
  1. `Back/test/unit/services/progreso.test.js` (`CP-01` a `CP-06`): `ProgresoDiario`, `ProgresoSemanal`, `ProgresoMensual`, `ProgresoBridge` y `ProgresoProxy` (con **Stub** de `Progreso.findOne` y **Spy** de `proxy.service.actualizar`).
  2. `Back/test/unit/services/usuarioValidacion.test.js` (`CP-07` a `CP-11` + teléfono): validación de correo, contraseña en límite 5 vs. 6 caracteres, edad, teléfono y cifrado `bcrypt`.
  3. `Back/test/unit/services/habitoNotificacion.test.js` (`CP-12` a `CP-15`): validación Mongoose de `Habito`, clonación con reinicio de progreso a `0` (`HabitoPrototype`) y **Mocks/Stubs** de `EmailAdapter` (`sendMail`) y `TelegramAdapter` (`sendMessage`).
- Alcanzamos **84.23% de cobertura de líneas** (meta mínima: 75%) con reporte HTML en `reports/coverage/index.html` y trazabilidad en commits (`9979575`, `0b83141`, `4423a6b`).

### ¿Qué comando usamos para probar que está correcto?
```powershell
# 1. Ejecutar solo las pruebas unitarias
npm.cmd run test:unit

# 2. Ejecutar las pruebas unitarias CON medición de cobertura (c8) y generar reporte HTML
npm.cmd run test:coverage

# 3. Ver los commits del historial de Git
git log -n 10 --oneline
```
- **Qué debe salir en consola:** `16 passing` (0 fallos) y tabla de `c8` mostrando **`All files | 84.23 % Lines`**.
- **Reporte HTML para abrir:** `Back\coverage\index.html` o `reports\coverage\index.html`.

---

## Entregable 3 · Pruebas de API REST con Postman y Newman (RAA3)

### ¿Qué hicimos?
- Completamos la API REST con autenticación **JWT** (`Back/src/helper/jwtHelper.js`), rutas `GET /usuario/:id`, `DELETE /usuario/:id` (eliminación en cascada) y `GET /habito/:id`, validaciones estrictas de códigos `4xx` (eliminando errores `500` ante entradas inválidas) y base de datos de pruebas automática con semillas (`Back/src/config/db.js` y `seed.js`).
- Creamos los 3 artefactos estándar de Postman en `Back/postman/`:
  - `HabitsUp.postman_collection.json` (formato **v2.1**, **5 carpetas**, **25 requests**):
    - Autenticación JWT automática (`CP-22` guarda `authToken` y el **Pre-request Script a nivel de colección** lo envía en `Authorization: Bearer {{authToken}}`).
    - **CRUD encadenado de 2 recursos** (`Usuarios` con `usuarioId` y `Hábitos` con `habitoId`).
    - **6 contratos JSON Schema** (`pm.response.to.have.jsonSchema(...)`).
    - **6 pruebas negativas con 5 códigos 4xx distintos** (`400`, `401`, `403`, `404`, `409`).
    - Verificación en todos los requests de: código de estado, `Content-Type`, body y tiempo de respuesta (`< 500 ms` consultas, `< 1000 ms` escrituras).
  - `HabitsUp.postman_environment.json` (sin credenciales reales).
  - `ddt_habitos.json` (**5 filas** para Data Driven Testing leídas con `pm.iterationData.get()` en `CP-36`).
- Configuramos Newman con `newman-reporter-htmlextra` en `Back/scripts/run-api-tests.js` y `package.json`.

### ¿Qué comando usamos para probar que está correcto?
```powershell
# Ejecutar toda la suite API con Newman + 5 iteraciones DDT + reporte HTML htmlextra
npm.cmd run test:api
```
*(Si quieres ejecutarlo visualmente dentro de Postman: enciende el backend con `node Back/src/server.js`, importa la colección y el environment desde `Back\postman\`, elige `HabitsUp Test Environment` y en Runner carga `ddt_habitos.json` en `Iteration data` → `Start run`).*

- **Qué debe salir en consola:** `iterations: 5 | requests: 125 | assertions: 530 | failed: 0` y tiempo promedio `~14 ms`.
- **Reporte HTML para abrir:** `reports\newman\habitsup-api-report.html`.

---

## Entregable 4 · Pruebas E2E con Playwright y Page Object Model (RAA4)

### ¿Qué hicimos?
- Configuramos `playwright.config.js` con `baseURL: 'http://localhost:5173'`, `testIdAttribute: 'data-testid'`, `screenshot: 'only-on-failure'`, `trace: 'on-first-retry'`, reporte HTML en `reports/playwright/`, `webServer` dual automático (Backend + Frontend) y **2 navegadores (`chromium` y `firefox`)**.
- Implementamos login reutilizable con **`storageState`** en el proyecto `setup` (`e2e/auth.setup.js` → `e2e/.auth/user.json`).
- Construimos **6 Page Objects** en `e2e/pages/` (`LandingPage`, `RegisterPage`, `LoginPage`, `DashboardPage`, `HabitoFormPage`, `ProfileModalPage`) inyectados con `test.extend` (`e2e/fixtures/testFixtures.js`), agregando atributos `data-testid` y etiquetas accesibles al Frontend.
- Implementamos **13 escenarios E2E** en 3 flujos críticos (`flujo1-autenticacion.spec.js`, `flujo2-habitos-crud.spec.js`, `flujo3-progreso-sugerencias.spec.js`), incluyendo **4 negativos** (`CP-37`, `CP-40`, `CP-41`, `CP-43`) y **DDT de 3 casos** (`CP-42`), cumpliendo 100% AAA, cero `waitForTimeout`, cero XPath/CSS y selección de listas con `.filter({ hasText })` sin `.nth()`.
- **Defecto real detectado y corregido (`DEF-01`):** `.tarjeta-bienvenida::after` interceptaba clics sobre `"Nuevo hábito"` en `Front/src/styles/general.css`; se corrigió con `pointer-events: none;`.

### ¿Qué comando usamos para probar que está correcto?
```powershell
# 1. Ejecutar los 3 flujos E2E del Entregable 4 en ambos navegadores (Chromium + Firefox)
npx.cmd playwright test e2e/flujo1-autenticacion.spec.js e2e/flujo2-habitos-crud.spec.js e2e/flujo3-progreso-sugerencias.spec.js

# 2. Verlo en vivo abriendo Chrome en pantalla (--headed)
npx.cmd playwright test e2e/flujo1-autenticacion.spec.js e2e/flujo2-habitos-crud.spec.js e2e/flujo3-progreso-sugerencias.spec.js --project=chromium --headed

# 3. Abrir el reporte HTML interactivo
npm.cmd run test:e2e:report
```
- **Qué debe salir en consola:** `27 passed` (`1 setup + 13 chromium + 13 firefox`, `0` fallos).
- **Reporte HTML para abrir:** `reports\playwright\index.html`.

---

## Entregable 5 · Pruebas E2E Asistidas por IA con Playwright MCP (RAA4)

### ¿Qué hicimos?
- Configuramos **Playwright MCP** en `.vscode/mcp.json` (`@playwright/mcp@latest`).
- Generamos y revisamos críticamente **3 nuevas pruebas E2E** no cubiertas en el Entregable 4, ubicadas en `e2e/ia/pruebas-asistidas-ia.spec.js`:
  - **`IA-01`:** Clonación de hábito completado al `100%` (patrón *Prototype*) validando que la copia `(copia)` inicia en `0%`.
  - **`IA-02`:** Edición de perfil en `ModalPerfil` (`ProfileModalPage`) y sincronización inmediata del nombre en `BarraSuperiorPanel`.
  - **`IA-03`:** Filtrado de sugerencias por categoría (`Estudio`) y cierre de sesión (`Logout`) redirigiendo a `/`.
- Documentamos en `Entregable_5_Pruebas_E2E_Asistidas_IA.md` para cada prueba: prompt estructurado, código sin editar, código final adaptado al POM, tabla de revisión crítica (*Human-in-the-Loop*) y reflexión.

### ¿Qué comando usamos para probar que está correcto?
```powershell
# 1. Ejecutar las 3 pruebas de IA en Chromium y Firefox
npx.cmd playwright test e2e/ia/pruebas-asistidas-ia.spec.js

# 2. Ver las 3 pruebas de IA ejecutándose en vivo en Chrome (--headed)
npx.cmd playwright test e2e/ia/pruebas-asistidas-ia.spec.js --project=chromium --headed
```
- **Qué debe salir en consola:** `7 passed` (`1 setup + 3 chromium + 3 firefox`, `0` fallos).
- **Documento a mostrar:** `Entregable_5_Pruebas_E2E_Asistidas_IA.md`.

---

## Entregable 6 · Integración Continua (CI/CD), Rendimiento y Accesibilidad (RAA5)

### ¿Qué hicimos?
- **Pipeline CI/CD (`.github/workflows/tests.yml`):** Workflow de GitHub Actions disparado en `push` y `pull_request` a `main`, dividido en **3 etapas secuenciales bloqueantes** (`unit-tests` → `api-tests [needs: unit-tests]` → `e2e-and-accessibility-tests [needs: api-tests]`), publicación de 5 artefactos, manejo exclusivo de credenciales por `secrets` y **badge del pipeline en `README.md`**.
- **Accesibilidad (`@axe-core/playwright` — `e2e/accesibilidad.spec.js`):** Auditoría automatizada sobre **4 vistas clave** (`A11Y-01` a `A11Y-04`) que falla ante violaciones `critical` o `serious`. Detectó 4 violaciones reales (`DEF-02: button-name`, `DEF-03: label`, `DEF-04: aria-progressbar-name`, `DEF-05: color-contrast`), todas corregidas en el Frontend hasta lograr **0 violaciones graves**.
- **Rendimiento y Accesibilidad (`Google Lighthouse` — `scripts/run-lighthouse.js`):** Medición automatizada de **3 páginas clave** obteniendo **100/100 en Rendimiento** y **97/100 en Accesibilidad** (`LCP ≤ 0.5 s`, `CLS: 0.002`, `TBT: 0 ms`).
- Documentación completa en `Entregable_6_CI_CD_Rendimiento_Accesibilidad.md`.

### ¿Qué comando usamos para probar que está correcto?
```powershell
# 1. Probar accesibilidad automatizada con @axe-core/playwright (4 vistas)
npm.cmd run test:a11y

# 2. Probar rendimiento y accesibilidad con Google Lighthouse (3 páginas clave)
npm.cmd run test:lighthouse

# 3. Ejecutar TODA la suite Playwright junta (Entregables 4 + 5 + 6 axe en Chromium y Firefox)
npm.cmd run test:e2e

# 4. Ejecutar TODA la pirámide completa (Unitarias + API + E2E + Lighthouse)
npm.cmd run test:all
```
- **Qué debe salir en consola:**
  - `test:a11y`: `5 passed` (`0` violaciones `critical`/`serious`).
  - `test:lighthouse`: tabla con `Rendimiento: 100`, `Accesibilidad: 97`, `LCP: 0.4s-0.5s`, `CLS: 0.002`, `TBT: 0 ms`.
  - `test:e2e`: `41 passed` en Chromium y Firefox.
- **Reportes HTML para abrir:**
  - `reports\accessibility\axe-report.html`
  - `reports\lighthouse\index.html`
  - En GitHub: pestaña **Actions** (`https://github.com/JAlfredoSoc/HabitsUp/actions`).
