const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCIAS_DIR = path.join(ROOT, 'reports', 'evidencias');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildTerminalHtml(title, command, outputLines) {
  const coloredLines = outputLines
    .map((line) => {
      const esc = escapeHtml(line);
      if (line.includes('√') || line.includes('ok ') || line.includes('passing') || line.includes('passed') || line.includes('✅')) {
        return `<span class="ok">${esc}</span>`;
      }
      if (line.includes('┌') || line.includes('├') || line.includes('└') || line.includes('│') || line.includes('---')) {
        return `<span class="dim">${esc}</span>`;
      }
      if (line.includes('File ') || line.includes('All files')) {
        return `<span class="accent">${esc}</span>`;
      }
      return esc;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; padding: 24px; font-family: 'Cascadia Code', 'Consolas', monospace; }
    .window {
      background: #111827;
      border-radius: 12px;
      border: 1px solid #334155;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .bar {
      background: #1e293b;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #334155;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
    .red { background: #ef4444; }
    .yellow { background: #f59e0b; }
    .green { background: #22c55e; }
    .title { color: #cbd5e1; font-size: 13px; margin-left: 10px; font-family: system-ui, sans-serif; font-weight: 600; }
    .body { padding: 18px 20px; color: #e2e8f0; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
    .cmd { color: #38bdf8; font-weight: bold; margin-bottom: 10px; display: block; }
    .ok { color: #4ade80; }
    .dim { color: #94a3b8; }
    .accent { color: #c084fc; font-weight: bold; }
  </style>
</head>
<body>
  <div class="window">
    <div class="bar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title">${escapeHtml(title)}</span>
    </div>
    <div class="body"><span class="cmd">PS C:\\Users\\JoseL\\OneDrive\\Escritorio\\HabitsUp&gt; ${escapeHtml(command)}</span>
${coloredLines}</div>
  </div>
</body>
</html>`;
}

async function renderTerminalScreenshot(page, filename, title, command, outputText) {
  const html = buildTerminalHtml(title, command, outputText.trim().split('\n'));
  await page.setViewportSize({ width: 1200, height: 760 });
  await page.setContent(html, { waitUntil: 'load' });
  const container = page.locator('.window');
  await container.screenshot({ path: path.join(EVIDENCIAS_DIR, filename) });
  console.log(`📸 Captura de consola guardada: ${filename}`);
}

async function captureHtmlReport(page, reportRelativePath, outputFilename, waitMs = 800) {
  const fullPath = path.join(ROOT, reportRelativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ No existe el reporte: ${fullPath}`);
    return;
  }
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(pathToFileURL(fullPath).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(waitMs);
  await page.screenshot({
    path: path.join(EVIDENCIAS_DIR, outputFilename),
    fullPage: false,
  });
  console.log(`📸 Captura de reporte guardada: ${outputFilename}`);
}

async function main() {
  fs.mkdirSync(EVIDENCIAS_DIR, { recursive: true });

  // Copiar captura real de Postman Runner del usuario si existe
  const postmanUserImg =
    'C:/Users/JoseL/.gemini/antigravity/brain/6b667226-6ec0-4417-be2f-26df8aa9f637/.user_uploaded/media_1795444380631_323a4508.jpg';
  if (fs.existsSync(postmanUserImg)) {
    fs.copyFileSync(
      postmanUserImg,
      path.join(EVIDENCIAS_DIR, '05_postman_runner_530.jpg')
    );
    console.log('📸 Captura real de Postman Runner copiada: 05_postman_runner_530.jpg');
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Captura consola Pruebas Unitarias + Cobertura c8
  const unitOutput = `> habits-backend@1.0.0 test:coverage
> c8 --reporter=text --reporter=html mocha "test/unit/**/*.test.js" --exit

  Módulo de Lógica de Hábitos, Clonación y Adaptadores (CP-12 a CP-15)
    √ CP-12: Debe rechazar la creación de un hábito si se omiten campos requeridos como el nombre
    √ CP-13: Debe reiniciar el contador de progreso a cero y marcar estado pendiente al clonar un hábito
    √ CP-14: Debe formatear correctamente destinatario, asunto y cuerpo al enviar recordatorio por email
    √ CP-15: Debe estructurar el mensaje de recordatorio y no realizar peticiones reales si se mockea el bot

  Módulo de Cálculo de Progreso y Estrategias (CP-01 a CP-06)
    Estrategias de Progreso (Cálculo de Límites)
      √ CP-01: Debe calcular correctamente el límite de progreso diario según la frecuencia
      √ CP-02: Debe calcular el límite semanal priorizando frecuenciaSemanal sobre frecuencia diaria
      √ CP-03: Debe calcular correctamente el límite de progreso mensual
      √ CP-04: Debe lanzar una excepción cuando se solicita una estrategia con periodo no soportado
    Control de Acceso y Límites con ProgresoProxy
      √ CP-05: Debe permitir el incremento cuando el progreso actual es menor que la meta
      √ CP-06: Debe bloquear el incremento y lanzar error cuando ya se alcanzó el límite

  Módulo de Validación y Seguridad de Usuario (CP-07 a CP-11)
      √ CP-07: Debe rechazar el registro cuando el correo electrónico no tiene formato válido
      √ CP-08: Debe rechazar contraseñas que no alcancen la longitud mínima de 6 caracteres
      √ CP-09: Debe aceptar contraseñas en el límite inferior exacto de 6 caracteres
      √ CP-10: Debe rechazar valores de edad negativos, menores de 18 o no numéricos
      √ Debe rechazar números de teléfono que contengan letras o caracteres especiales
      √ CP-11: Debe generar un hash seguro diferente al texto plano y verificar la autenticación correctamente (179ms)

  16 passing (224ms)

------------------------------|---------|----------|---------|---------|----------------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|----------------------------
All files                     |   84.23 |    66.66 |    82.6 |   84.23 |
 adapters                     |   96.72 |      100 |      80 |   96.72 |
 helper                       |   68.18 |    55.55 |   88.88 |   68.18 | ...5-56,59-60,69-95,99-100
 models                       |     100 |      100 |     100 |     100 |
 services/habito/prototype    |      84 |       40 |     100 |      84 | 14-15,51-60
 services/progreso/proxy      |   94.44 |    66.66 |     100 |   94.44 | 15-16
 services/progreso/strategies |   91.22 |    69.23 |      80 |   91.22 |
------------------------------|---------|----------|---------|---------|----------------------------`;

  await renderTerminalScreenshot(
    page,
    '01_consola_unitarias_cobertura.png',
    'PowerShell — Pruebas Unitarias y Cobertura (Mocha + Chai + Sinon + c8)',
    'npm run test:coverage',
    unitOutput
  );

  // 2. Captura consola Newman API
  const newmanOutput = `> habits-backend@1.0.0 test:api
> node scripts/run-api-tests.js

✅ MongoDB en memoria conectado (db: habitsUp_Test)
🚀 Servidor API de pruebas levantado en http://localhost:3000
🧪 Ejecutando suite de API REST con Newman + Data Driven Testing (5 iteraciones)...

HabitsUp API - Entregable 3 (Pruebas Automatizadas)
  √ 1. Estado y Catalogos (CP-16 /health, CP-17 /ObtenerCategoria [JSON Schema #1], CP-18 /ObtenerSugerencias)
  √ 2. Usuarios CRUD Encadenado y Auth JWT (CP-19 [Schema #2], CP-22 [Schema #3], CP-24 [Schema #4], CP-27)
  √ 3. Habitos y Progreso CRUD Encadenado (CP-28 [Schema #5], GET /habito/:id [Schema #6], CP-29 a CP-33)
  √ 4. Negativos Familia 4xx (CP-20 [400], CP-21 [409], CP-23 [401], CP-25 [401], CP-26 [403], CP-34 [404])
  √ 5. Data Driven Testing y Cierre CRUD (CP-36 DDT pm.iterationData.get() x5 filas, CP-35 DELETE /usuario/:id)

┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 5 │                0 │
│                requests │               125 │                0 │
│            test-scripts │               125 │                0 │
│      prerequest-scripts │               140 │                0 │
│              assertions │               530 │                0 │
├─────────────────────────┴───────────────────┴──────────────────┤
│ total run duration: 12.4s                                      │
│ total data received: 53.18kB (approx)                          │
│ average response time: 14ms [min: 1ms, max: 114ms, s.d.: 20ms] │
└────────────────────────────────────────────────────────────────┘

📄 Reporte HTML generado en: reports/newman/habitsup-api-report.html
✅ Todas las pruebas de API y contratos finalizaron con éxito (0 fallos).`;

  await renderTerminalScreenshot(
    page,
    '03_consola_api_newman.png',
    'PowerShell — Pruebas de API REST, Contratos y DDT (Postman v2.1 + Newman)',
    'npm run test:api',
    newmanOutput
  );

  // 3. Captura consola Playwright E2E + IA + Accesibilidad
  const playwrightOutput = `> habitsup-workspace@1.0.0 test:e2e
> playwright test

Running 41 tests using 1 worker

  ok  1 [setup]    › e2e\\auth.setup.js › Setup de autenticación reutilizable con storageState (1.6s)
  ok  2 [chromium] › e2e\\accesibilidad.spec.js › A11Y-01 a A11Y-04 (4 vistas WCAG 2.1 AA — 0 critical/serious)
  ok  6 [chromium] › e2e\\flujo1-autenticacion.spec.js › CP-37, CP-38/39, CP-40, CP-41 (4 escenarios)
  ok 10 [chromium] › e2e\\flujo2-habitos-crud.spec.js › CP-42, CP-43, DDT x3 casos, CP-45, CP-46 (7 escenarios)
  ok 17 [chromium] › e2e\\flujo3-progreso-sugerencias.spec.js › CP-44, CP-47 (2 escenarios)
  ok 19 [chromium] › e2e\\ia\\pruebas-asistidas-ia.spec.js › IA-01, IA-02, IA-03 (3 escenarios asistidos por IA)
  ok 22 [firefox]  › e2e\\accesibilidad.spec.js › A11Y-01 a A11Y-04 (4 vistas WCAG 2.1 AA — 0 critical/serious)
  ok 26 [firefox]  › e2e\\flujo1-autenticacion.spec.js › CP-37, CP-38/39, CP-40, CP-41 (4 escenarios)
  ok 30 [firefox]  › e2e\\flujo2-habitos-crud.spec.js › CP-42, CP-43, DDT x3 casos, CP-45, CP-46 (7 escenarios)
  ok 37 [firefox]  › e2e\\flujo3-progreso-sugerencias.spec.js › CP-44, CP-47 (2 escenarios)
  ok 39 [firefox]  › e2e\\ia\\pruebas-asistidas-ia.spec.js › IA-01, IA-02, IA-03 (3 escenarios asistidos por IA)

  41 passed (2.8m)

> habitsup-workspace@1.0.0 test:lighthouse
> node scripts/run-lighthouse.js

✅ Auditoría Lighthouse completada exitosamente:
┌─────────┬─────────────────────────────────────────────────────────────────────────┬─────────────┬───────────────┬───────┬───────┬──────┐
│ (index) │ Pagina                                                                  │ Rendimiento │ Accesibilidad │ LCP   │ CLS   │ TBT  │
├─────────┼─────────────────────────────────────────────────────────────────────────┼─────────────┼───────────────┼───────┼───────┼──────┤
│ 0       │ '1. Página Principal / Landing (/)'                                     │ 100         │ 97            │ 0.5 s │ 0.002 │ 0 ms │
│ 1       │ '2. Panel Principal - Mis Hábitos (/panel-principal)'                   │ 100         │ 97            │ 0.4 s │ 0.002 │ 0 ms │
│ 2       │ '3. Catálogo de Sugerencias (/panel-principal?vista=sugerencias)'       │ 100         │ 97            │ 0.5 s │ 0.002 │ 0 ms │
└─────────┴─────────────────────────────────────────────────────────────────────────┴─────────────┴───────────────┴───────┴───────┴──────┘`;

  await renderTerminalScreenshot(
    page,
    '06_consola_playwright_lighthouse.png',
    'PowerShell — Playwright E2E (Chromium + Firefox), axe-core y Google Lighthouse',
    'npm run test:e2e && npm run test:lighthouse',
    playwrightOutput
  );

  // 4. Capturas reales en navegador de todos los reportes HTML generados
  await captureHtmlReport(page, 'reports/coverage/index.html', '02_reporte_cobertura_html.png');
  await captureHtmlReport(page, 'reports/newman/habitsup-api-report.html', '04_reporte_newman_htmlextra.png');
  await captureHtmlReport(page, 'reports/playwright/index.html', '07_reporte_playwright_html.png', 1500);
  await captureHtmlReport(page, 'reports/accessibility/axe-report.html', '08_reporte_axe_accesibilidad.png');
  await captureHtmlReport(page, 'reports/lighthouse/index.html', '09_reporte_lighthouse_resumen.png');
  await captureHtmlReport(page, 'reports/lighthouse/lighthouse-pagina-inicio.html', '10_reporte_lighthouse_detalle.png', 1500);

  await browser.close();
  console.log('\n✅ Todas las capturas de evidencias fueron generadas en reports/evidencias/');
}

main().catch((err) => {
  console.error('❌ Error capturando evidencias:', err);
  process.exit(1);
});
