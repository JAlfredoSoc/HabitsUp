const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');

function buildGuideHtml() {
  return String.raw`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Guía de Sustentación y Verificación — Entregables 1 al 6 (Habits UP)</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 18mm 14mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      color: #1e293b;
      font-size: 9.2pt;
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }
    .banner {
      background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
      color: #ffffff;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 14px;
    }
    .banner-sub {
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      opacity: 0.9;
      margin: 0 0 4px;
      font-weight: 700;
    }
    .banner h1 {
      font-size: 17pt;
      margin: 0 0 6px;
      color: #ffffff;
      border: none;
      padding: 0;
    }
    .banner p {
      margin: 0;
      font-size: 9pt;
      opacity: 0.95;
    }
    .card {
      border: 1px solid #cbd5e1;
      border-left: 5px solid #6d28d9;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
      background: #ffffff;
      page-break-inside: avoid;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .card-title {
      font-size: 11.5pt;
      font-weight: 800;
      color: #3b0764;
      margin: 0;
    }
    .pill {
      background: #ede9fe;
      color: #4c1d95;
      font-weight: 700;
      font-size: 7.8pt;
      padding: 3px 9px;
      border-radius: 999px;
    }
    .section-label {
      font-size: 8.4pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6d28d9;
      margin: 7px 0 4px;
    }
    ul {
      margin: 3px 0 8px 18px;
      padding: 0;
    }
    li { margin-bottom: 3px; }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 9px 11px;
      border-radius: 6px;
      font-family: 'Cascadia Code', 'Consolas', monospace;
      font-size: 8pt;
      line-height: 1.45;
      margin: 4px 0 8px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .cmd-comment { color: #94a3b8; }
    .cmd-text { color: #38bdf8; font-weight: 600; }
    code {
      background: #f1f5f9;
      color: #4c1d95;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: 'Cascadia Code', 'Consolas', monospace;
      font-size: 8.2pt;
    }
    .result-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      border-radius: 5px;
      padding: 7px 10px;
      font-size: 8.4pt;
      color: #14532d;
    }
    table.summary {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 8pt;
    }
    table.summary th {
      background: #4c1d95;
      color: #ffffff;
      padding: 6px 7px;
      text-align: left;
      border: 1px solid #4c1d95;
    }
    table.summary td {
      padding: 5px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    table.summary tbody tr:nth-child(even) { background: #f8fafc; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>

  <div class="banner">
    <div class="banner-sub">Universidad Popular del Cesar · Ingeniería de Pruebas Automatizadas</div>
    <h1>Guía de Sustentación y Comandos de Verificación (Entregables 1 al 6)</h1>
    <p><strong>Proyecto:</strong> Habits UP &nbsp;|&nbsp; <strong>Equipo:</strong> Jose Alfredo Maestre Manjarrez &amp; Ismael Jose Peñaloza Ortiz &nbsp;|&nbsp; <strong>Docente:</strong> Ing. Esp. Amilkar Hernandez</p>
  </div>

  <div class="card" style="border-left-color:#0284c7;">
    <div class="card-header">
      <div class="card-title" style="color:#0369a1;">Preparación Rápida (Solo si ejecutas desde un clon limpio)</div>
      <span class="pill" style="background:#e0f2fe;color:#0369a1;">PowerShell Windows</span>
    </div>
    <p style="margin:0 0 6px;">Todos los comandos siguientes se ejecutan desde la carpeta raíz del proyecto: <code>c:\Users\JoseL\OneDrive\Escritorio\HabitsUp</code>. <em>(En Windows PowerShell usamos <code>npm.cmd</code> / <code>npx.cmd</code> para evitar bloqueos de ExecutionPolicy; en Git Bash/Linux se usa <code>npm</code> / <code>npx</code>).</em></p>
    <pre><span class="cmd-comment"># Instalar dependencias de Raíz, Backend, Frontend y navegadores Playwright</span>
<span class="cmd-text">npm.cmd install; npm.cmd --prefix Back install; npm.cmd --prefix Front install; npx.cmd playwright install chromium firefox</span></pre>
  </div>

  <!-- ENTREGABLE 1 -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Entregable 1 · Plan de Pruebas y Diseño de Casos</div>
      <span class="pill">RAA1 · Documental</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li>Creamos <code>Plan_Pruebas_Habits_UP.md</code> definiendo el propósito del sistema, la arquitectura desacoplada (React 19 + Vite 8 → Express 5 + Mongoose 8 → MongoDB) y el stack completo de pruebas.</li>
      <li>Definimos los roles del equipo en el SDLC, la <strong>Pirámide de Pruebas</strong>, tipos de prueba (funcional, humo, regresión, negativa, contrato, DDT, rendimiento y accesibilidad), criterios de entrada/salida, riesgos priorizados, datos semilla y política de limpieza sobre <code>habitsUp_Test</code>.</li>
      <li>Diseñamos una matriz formal con <strong>47 casos de prueba trazables</strong> (<code>CP-01</code> a <code>CP-47</code>), superando el mínimo exigido de 20 casos.</li>
    </ul>
    <div class="section-label">Comando para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># Contar los casos de prueba (CP-01 a CP-47) presentes en el documento del Plan de Pruebas</span>
<span class="cmd-text">Select-String -Path .\Plan_Pruebas_Habits_UP.md -Pattern "\*\*CP-\d+\*\*" | Measure-Object</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> El conteo confirma los 47 casos diseñados en la matriz. Abre <code>Plan_Pruebas_Habits_UP.md</code> en VS Code (<code>Ctrl + Shift + V</code>) para mostrar las tablas y la pirámide.
    </div>
  </div>

  <!-- ENTREGABLE 2 -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Entregable 2 · Pruebas Unitarias, Mocking, TDD y Cobertura</div>
      <span class="pill">RAA2 · Mocha + Chai + Sinon + c8</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li>Implementamos <strong>16 pruebas unitarias</strong> (mínimo: 15) con bloques <code>// Arrange</code>, <code>// Act</code>, <code>// Assert</code> y hooks <code>afterEach</code> en <strong>3 módulos reales</strong>:
        <br/>1) <code>Back/test/unit/services/progreso.test.js</code> (<code>CP-01</code> a <code>CP-06</code>): estrategias diaria/semanal/mensual, <code>ProgresoBridge</code> y <code>ProgresoProxy</code> con <strong>Stub + Spy</strong> de Sinon.
        <br/>2) <code>Back/test/unit/services/usuarioValidacion.test.js</code> (<code>CP-07</code> a <code>CP-11</code> + teléfono): validaciones límite (contraseña 5 vs. 6, edad, email) y cifrado <code>bcrypt</code>.
        <br/>3) <code>Back/test/unit/services/habitoNotificacion.test.js</code> (<code>CP-12</code> a <code>CP-15</code>): esquema Mongoose, clonación con reinicio a <code>0</code> y <strong>Mocks/Stubs</strong> de <code>EmailAdapter</code> y <code>TelegramAdapter</code>.</li>
      <li>Configuramos medición de cobertura con <code>c8</code> alcanzando <strong>84.23% de líneas</strong> (meta mínima: 75%) con reporte HTML y commits de evolución/refactorización (<code>9979575</code>, <code>0b83141</code>, <code>4423a6b</code>).</li>
    </ul>
    <div class="section-label">Comandos para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># Ejecutar las 16 pruebas unitarias</span>
<span class="cmd-text">npm.cmd run test:unit</span>

<span class="cmd-comment"># Ejecutar las pruebas unitarias CON medición de cobertura c8 y generar reporte HTML</span>
<span class="cmd-text">npm.cmd run test:coverage</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> <code>16 passing</code> (~220 ms) y la tabla de <code>c8</code> con <strong><code>All files: 84.23% Lines</code></strong>. Reporte HTML en <code>reports\coverage\index.html</code> (o <code>Back\coverage\index.html</code>).
    </div>
  </div>

  <!-- ENTREGABLE 3 -->
  <div class="card page-break">
    <div class="card-header">
      <div class="card-title">Entregable 3 · Pruebas de API REST con Postman y Newman</div>
      <span class="pill">RAA3 · Postman v2.1 + Newman + DDT</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li>Añadimos autenticación <strong>JWT</strong> (<code>Back/src/helper/jwtHelper.js</code>), endpoints <code>GET /usuario/:id</code>, <code>DELETE /usuario/:id</code> (cascada) y <code>GET /habito/:id</code>, códigos <code>4xx</code> estrictos y BD en memoria con semillas automáticas (<code>db.js</code> + <code>seed.js</code>).</li>
      <li>Creamos la colección <strong>v2.1</strong> (<code>Back/postman/HabitsUp.postman_collection.json</code>) en <strong>5 carpetas y 25 requests</strong>: login que guarda <code>authToken</code> + <strong>Pre-request global</strong> que envía el Bearer token, <strong>CRUD encadenado</strong> de Usuarios (<code>usuarioId</code>) y Hábitos (<code>habitoId</code>), <strong>6 contratos JSON Schema</strong>, <strong>6 negativos con 5 códigos 4xx distintos</strong> (<code>400, 401, 403, 404, 409</code>) y umbrales de tiempo (<code>&lt;500 ms</code> lectura / <code>&lt;1000 ms</code> escritura) en todos los requests.</li>
      <li>Creamos el environment sin credenciales reales (<code>HabitsUp.postman_environment.json</code>), el archivo <strong>DDT de 5 filas</strong> (<code>ddt_habitos.json</code> leído con <code>pm.iterationData.get()</code>) y el orquestador Newman (<code>Back/scripts/run-api-tests.js</code>) con reporte <code>newman-reporter-htmlextra</code>.</li>
    </ul>
    <div class="section-label">Comando para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># Levanta el backend automáticamente, ejecuta Newman + 5 iteraciones DDT y genera reporte htmlextra</span>
<span class="cmd-text">npm.cmd run test:api</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> Tabla de Newman con <strong><code>iterations: 5 | requests: 125 | assertions: 530 | failed: 0</code></strong> y promedio <code>~14 ms</code>. Reporte visual en <code>reports\newman\habitsup-api-report.html</code>. <em>(En Postman GUI: levantar <code>node Back/src/server.js</code>, importar colección + environment y correr Runner con <code>ddt_habitos.json</code>).</em>
    </div>
  </div>

  <!-- ENTREGABLE 4 -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Entregable 4 · Pruebas E2E con Playwright y Page Object Model</div>
      <span class="pill">RAA4 · Playwright POM + 2 Navegadores</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li>Configuramos <code>playwright.config.js</code> con <code>baseURL</code>, <code>testIdAttribute: 'data-testid'</code>, <code>screenshot: 'only-on-failure'</code>, <code>trace: 'on-first-retry'</code>, reporte HTML en <code>reports/playwright/</code>, <code>webServer</code> dual (Backend + Frontend) y <strong>2 navegadores (Chromium y Firefox)</strong>.</li>
      <li>Implementamos login reutilizable con <strong><code>storageState</code></strong> en <code>e2e/auth.setup.js</code>, <strong>6 Page Objects</strong> en <code>e2e/pages/</code> inyectados vía <code>test.extend</code> (<code>e2e/fixtures/testFixtures.js</code>) y agregamos atributos <code>data-testid</code> y <code>RutaProtegida</code> en el Frontend.</li>
      <li>Automatizamos <strong>13 escenarios en 3 flujos críticos</strong> (<code>flujo1-autenticacion.spec.js</code>, <code>flujo2-habitos-crud.spec.js</code>, <code>flujo3-progreso-sugerencias.spec.js</code>), incluyendo <strong>4 negativos</strong> y <strong>1 DDT de 3 casos</strong>, con 100% AAA, cero <code>waitForTimeout</code>, cero CSS/XPath y selección de listas con <code>.filter({ hasText })</code> (cero <code>.nth()</code>).</li>
      <li><strong>Defecto real encontrado y corregido (<code>DEF-01</code>):</strong> <code>.tarjeta-bienvenida::after</code> bloqueaba los clics en <em>"Nuevo hábito"</em> (corregido con <code>pointer-events: none;</code> en <code>general.css</code>).</li>
    </ul>
    <div class="section-label">Comandos para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># 1. Correr los 3 flujos del Entregable 4 en Chromium y Firefox (modo headless)</span>
<span class="cmd-text">npx.cmd playwright test e2e/flujo1-autenticacion.spec.js e2e/flujo2-habitos-crud.spec.js e2e/flujo3-progreso-sugerencias.spec.js</span>

<span class="cmd-comment"># 2. Verlo en vivo con el navegador Chrome abierto en tu pantalla (--headed)</span>
<span class="cmd-text">npx.cmd playwright test e2e/flujo1-autenticacion.spec.js e2e/flujo2-habitos-crud.spec.js e2e/flujo3-progreso-sugerencias.spec.js --project=chromium --headed</span>

<span class="cmd-comment"># 3. Abrir el reporte HTML de Playwright</span>
<span class="cmd-text">npm.cmd run test:e2e:report</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> <strong><code>27 passed</code></strong> (1 setup + 13 Chromium + 13 Firefox, 0 fallos). Reporte en <code>reports\playwright\index.html</code>.
    </div>
  </div>

  <!-- ENTREGABLE 5 -->
  <div class="card page-break">
    <div class="card-header">
      <div class="card-title">Entregable 5 · Pruebas E2E Asistidas por IA con Playwright MCP</div>
      <span class="pill">RAA4 · Playwright MCP + e2e/ia/</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li>Configuramos el servidor <strong>Playwright MCP</strong> en <code>.vscode/mcp.json</code> (<code>@playwright/mcp@latest</code>).</li>
      <li>Generamos con asistencia de IA y adaptamos al Page Object Model <strong>3 nuevas pruebas E2E</strong> no cubiertas en el Entregable 4, ubicadas en <code>e2e/ia/pruebas-asistidas-ia.spec.js</code>:
        <br/>• <strong><code>IA-01</code>:</strong> Clonación de hábito completado al <code>100%</code> (<em>Prototype</em>) verificando copia en <code>0%</code> y original en <code>100%</code>.
        <br/>• <strong><code>IA-02</code>:</strong> Edición de nombre y teléfono en <code>ModalPerfil</code> (<code>ProfileModalPage</code>) y sincronización con la barra superior.
        <br/>• <strong><code>IA-03</code>:</strong> Filtrado dinámico de sugerencias por categoría (<code>Estudio</code>) y cierre de sesión redirigiendo a <code>/</code>.</li>
      <li>Documentamos en <code>Entregable_5_Pruebas_E2E_Asistidas_IA.md</code> los prompts estructurados, el código generado sin editar vs. el código final revisado, la tabla de revisión crítica y la reflexión.</li>
    </ul>
    <div class="section-label">Comandos para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># 1. Ejecutar las 3 pruebas asistidas por IA en Chromium y Firefox</span>
<span class="cmd-text">npx.cmd playwright test e2e/ia/pruebas-asistidas-ia.spec.js</span>

<span class="cmd-comment"># 2. Ver las 3 pruebas de IA ejecutándose en vivo en pantalla (--headed)</span>
<span class="cmd-text">npx.cmd playwright test e2e/ia/pruebas-asistidas-ia.spec.js --project=chromium --headed</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> <strong><code>7 passed</code></strong> (1 setup + 3 Chromium + 3 Firefox, 0 fallos) y el documento <code>Entregable_5_Pruebas_E2E_Asistidas_IA.md</code>.
    </div>
  </div>

  <!-- ENTREGABLE 6 -->
  <div class="card">
    <div class="card-header">
      <div class="card-title">Entregable 6 · Integración Continua (CI/CD), Rendimiento y Accesibilidad</div>
      <span class="pill">RAA5 · GitHub Actions + axe + Lighthouse</span>
    </div>
    <div class="section-label">¿Qué hicimos?</div>
    <ul>
      <li><strong>Pipeline CI/CD (<code>.github/workflows/tests.yml</code>):</strong> Se dispara en cada <code>push</code> y <code>pull_request</code> a <code>main</code> con <strong>3 etapas secuenciales bloqueantes</strong> (<code>unit-tests</code> → <code>api-tests</code> → <code>e2e-and-accessibility-tests</code>), publicación de los 5 artefactos de reporte, credenciales en <code>secrets</code> y <strong>badge del pipeline en <code>README.md</code></strong>.</li>
      <li><strong>Accesibilidad (<code>@axe-core/playwright</code> — <code>e2e/accesibilidad.spec.js</code>):</strong> Audita <strong>4 vistas clave</strong> (<code>A11Y-01</code> a <code>A11Y-04</code>) fallando ante violaciones <code>critical/serious</code>. Detectó 4 defectos reales (<code>DEF-02: button-name</code>, <code>DEF-03: label</code>, <code>DEF-04: aria-progressbar-name</code>, <code>DEF-05: color-contrast</code>), todos corregidos hasta lograr <strong>0 violaciones graves</strong>.</li>
      <li><strong>Rendimiento Web (<code>Google Lighthouse</code> — <code>scripts/run-lighthouse.js</code>):</strong> Evalúa <strong>3 páginas clave</strong> logrando <strong>100/100 en Rendimiento</strong>, <strong>97/100 en Accesibilidad</strong>, <code>LCP ≤ 0.5 s</code>, <code>CLS: 0.002</code> y <code>TBT: 0 ms</code>.</li>
    </ul>
    <div class="section-label">Comandos para comprobar que está correcto</div>
    <pre><span class="cmd-comment"># 1. Ejecutar auditoría automatizada de accesibilidad (@axe-core/playwright en 4 vistas)</span>
<span class="cmd-text">npm.cmd run test:a11y</span>

<span class="cmd-comment"># 2. Ejecutar auditoría de rendimiento y accesibilidad con Google Lighthouse (3 páginas clave)</span>
<span class="cmd-text">npm.cmd run test:lighthouse</span>

<span class="cmd-comment"># 3. Ejecutar TODA la suite Playwright completa (Entregables 4 + 5 + 6 axe en Chromium y Firefox)</span>
<span class="cmd-text">npm.cmd run test:e2e</span></pre>
    <div class="result-box">
      <strong>Qué debes ver / mostrar:</strong> <code>test:a11y</code> → <strong><code>5 passed</code></strong> (reporte en <code>reports\accessibility\axe-report.html</code>); <code>test:lighthouse</code> → <strong><code>100 Rendimiento / 97 Accesibilidad</code></strong> (reporte en <code>reports\lighthouse\index.html</code>); <code>test:e2e</code> → <strong><code>41 passed</code></strong>; y en GitHub pestaña <strong>Actions</strong> el pipeline en verde con sus 5 artefactos.
    </div>
  </div>

  <!-- TABLA RESUMEN RAPIDA -->
  <div class="card" style="border-left-color:#16a34a;">
    <div class="card-header">
      <div class="card-title" style="color:#15803d;">Hoja Rápida de Comandos para Sustentación en Vivo (1 Comando por Nivel)</div>
      <span class="pill" style="background:#dcfce7;color:#166534;">Cheat Sheet</span>
    </div>
    <table class="summary">
      <thead>
        <tr><th>Entregable</th><th>Comando exacto en PowerShell</th><th>Salida Esperada</th><th>Reporte / Archivo a Abrir</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Entregable 1</strong> (Plan)</td><td><code>Select-String -Path .\Plan_Pruebas_Habits_UP.md -Pattern "\*\*CP-\d+\*\*" | Measure-Object</code></td><td>47 casos diseñados</td><td><code>Plan_Pruebas_Habits_UP.md</code></td></tr>
        <tr><td><strong>Entregable 2</strong> (Unit + Cov)</td><td><code>npm.cmd run test:coverage</code></td><td><code>16 passing</code> · <strong>84.23% líneas</strong></td><td><code>reports\coverage\index.html</code></td></tr>
        <tr><td><strong>Entregable 3</strong> (API Newman)</td><td><code>npm.cmd run test:api</code></td><td><code>5 iter · 125 req · 530 asserts · 0 fail</code></td><td><code>reports\newman\habitsup-api-report.html</code></td></tr>
        <tr><td><strong>Entregable 4</strong> (E2E POM)</td><td><code>npx.cmd playwright test e2e/flujo*.spec.js</code></td><td><code>27 passed</code> (Chromium + Firefox)</td><td><code>reports\playwright\index.html</code></td></tr>
        <tr><td><strong>Entregable 5</strong> (E2E IA)</td><td><code>npx.cmd playwright test e2e/ia/pruebas-asistidas-ia.spec.js</code></td><td><code>7 passed</code> (Chromium + Firefox)</td><td><code>Entregable_5_Pruebas_E2E_Asistidas_IA.md</code></td></tr>
        <tr><td><strong>Entregable 6</strong> (A11y + Perf)</td><td><code>npm.cmd run test:a11y; npm.cmd run test:lighthouse</code></td><td><code>5 passed</code> (axe) · <strong>100/97</strong> (Lighthouse)</td><td><code>reports\accessibility\axe-report.html</code> y <code>reports\lighthouse\index.html</code></td></tr>
        <tr><td><strong>TODO JUNTO</strong> (Suite Completa)</td><td><code>npm.cmd run test:all</code></td><td><strong>100% en verde en todos los niveles</strong></td><td><code>Informe_Final_Habits_UP.pdf</code></td></tr>
      </tbody>
    </table>
  </div>

</body>
</html>`;
}

async function main() {
  const html = buildGuideHtml();
  const pdfPath = path.join(ROOT, 'Guia_Sustentacion_Entregables_1_al_6.pdf');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate:
      '<div style="font-size:7.5pt;color:#64748b;width:100%;padding:0 14mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif;"><span>Habits UP — Guía de Sustentación y Verificación</span><span>Entregables 1 al 6</span></div>',
    footerTemplate:
      '<div style="font-size:7.5pt;color:#64748b;width:100%;padding:0 14mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif;"><span>Universidad Popular del Cesar · Ingeniería de Pruebas Automatizadas</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>',
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '12mm',
      right: '12mm',
    },
  });
  await browser.close();
  console.log(`✅ Guía PDF generada en: ${pdfPath}`);
}

main().catch((err) => {
  console.error('❌ Error generando la guía PDF:', err);
  process.exit(1);
});
