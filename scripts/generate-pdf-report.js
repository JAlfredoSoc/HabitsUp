const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCIAS_DIR = path.join(ROOT, 'reports', 'evidencias');

function imgDataUri(filename) {
  const fullPath = path.join(EVIDENCIAS_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Imagen no encontrada para incrustar: ${filename}`);
    return '';
  }
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  const base64 = fs.readFileSync(fullPath).toString('base64');
  return `data:${mime};base64,${base64}`;
}

function figureBlock(filename, caption) {
  const src = imgDataUri(filename);
  if (!src) return '';
  return `
    <figure class="evidence-fig">
      <img src="${src}" alt="${caption}" />
      <figcaption>${caption}</figcaption>
    </figure>
  `;
}

function buildFullHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Informe Final — Pruebas Automatizadas Habits UP</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      color: #1e293b;
      font-size: 9.2pt;
      line-height: 1.44;
      margin: 0;
      padding: 0;
    }

    /* Portada */
    .cover {
      min-height: 252mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid #5b21b6;
      border-radius: 12px;
      padding: 26mm 20mm;
      background: linear-gradient(180deg, #faf5ff 0%, #ffffff 35%, #f8fafc 100%);
      page-break-after: always;
    }
    .cover-header {
      text-align: center;
      border-bottom: 3px solid #6d28d9;
      padding-bottom: 14px;
    }
    .cover-uni {
      font-size: 16pt;
      font-weight: 800;
      color: #14532d;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .cover-faculty {
      font-size: 10.5pt;
      color: #475569;
      font-weight: 600;
      margin: 4px 0 0;
    }
    .cover-main {
      text-align: center;
      margin: 28px 0;
    }
    .cover-tag {
      display: inline-block;
      background: #6d28d9;
      color: #fff;
      font-size: 9pt;
      font-weight: 700;
      padding: 5px 16px;
      border-radius: 999px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .cover-title {
      font-size: 23pt;
      font-weight: 800;
      color: #3b0764;
      margin: 0 0 10px;
      line-height: 1.2;
    }
    .cover-subtitle {
      font-size: 12pt;
      color: #475569;
      margin: 0;
    }
    .cover-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .cover-table th {
      background: #f3e8ff;
      color: #4c1d95;
      text-align: left;
      width: 32%;
      padding: 9px 12px;
      font-size: 9.2pt;
      border-bottom: 1px solid #e2e8f0;
    }
    .cover-table td {
      padding: 9px 12px;
      font-size: 9.2pt;
      border-bottom: 1px solid #e2e8f0;
      color: #0f172a;
    }
    .cover-footer {
      text-align: center;
      font-size: 9.5pt;
      color: #64748b;
      border-top: 1px solid #cbd5e1;
      padding-top: 12px;
    }

    /* Secciones */
    h1 {
      font-size: 14.5pt;
      color: #4c1d95;
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 4px;
      margin: 18px 0 10px;
      page-break-after: avoid;
    }
    h2 {
      font-size: 11.2pt;
      color: #1e1b4b;
      margin: 13px 0 6px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 10pt;
      color: #5b21b6;
      margin: 10px 0 4px;
      page-break-after: avoid;
    }
    p { margin: 0 0 8px; text-align: justify; }
    ul, ol { margin: 4px 0 10px 18px; padding: 0; }
    li { margin-bottom: 4px; }

    .page-break { page-break-before: always; }

    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 12px 0 14px;
    }
    .kpi {
      background: #faf5ff;
      border: 1px solid #ddd6fe;
      border-left: 4px solid #6d28d9;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .kpi-val { font-size: 14pt; font-weight: 800; color: #4c1d95; }
    .kpi-lbl { font-size: 7.8pt; color: #475569; font-weight: 600; text-transform: uppercase; }

    /* Tablas */
    table.data {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 14px;
      font-size: 8.1pt;
      page-break-inside: auto;
    }
    table.data tr { page-break-inside: avoid; }
    table.data thead { display: table-header-group; }
    table.data th {
      background: #4c1d95;
      color: #ffffff;
      padding: 6px 7px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #4c1d95;
    }
    table.data td {
      padding: 5px 7px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    table.data tbody tr:nth-child(even) { background: #f8fafc; }

    /* Badges */
    .badge-pass {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 2px 6px;
      border-radius: 999px;
    }
    .badge-high {
      display: inline-block;
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 2px 6px;
      border-radius: 999px;
    }
    .badge-med {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-weight: 700;
      font-size: 7.5pt;
      padding: 2px 6px;
      border-radius: 999px;
    }

    /* Callouts & Code */
    .callout {
      background: #f5f3ff;
      border-left: 4px solid #6d28d9;
      padding: 9px 12px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 8.8pt;
    }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: 'Cascadia Code', 'Consolas', monospace;
      font-size: 7.6pt;
      line-height: 1.42;
      overflow-x: hidden;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 6px 0 12px;
      page-break-inside: avoid;
    }
    code {
      background: #f1f5f9;
      color: #4c1d95;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: 'Cascadia Code', 'Consolas', monospace;
      font-size: 8.2pt;
    }
    pre code { background: transparent; color: inherit; padding: 0; }

    /* Figuras e Imágenes */
    figure.evidence-fig {
      margin: 10px 0 14px;
      text-align: center;
      page-break-inside: avoid;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px;
      background: #ffffff;
    }
    figure.evidence-fig img {
      max-width: 100%;
      max-height: 105mm;
      object-fit: contain;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }
    figure.evidence-fig figcaption {
      margin-top: 6px;
      font-size: 8pt;
      color: #475569;
      font-style: italic;
    }
  </style>
</head>
<body>

  <!-- ===================== 1. PORTADA ===================== -->
  <section class="cover">
    <div class="cover-header">
      <p class="cover-uni">UNIVERSIDAD POPULAR DEL CESAR</p>
      <p class="cover-faculty">Facultad de Ingenierías y Tecnológicas — Programa de Ingeniería de Sistemas</p>
      <p class="cover-faculty">Asignatura Electiva: INGENIERÍA DE PRUEBAS AUTOMATIZADAS</p>
    </div>

    <div class="cover-main">
      <div class="cover-tag">Informe Final — Proyecto Integrador de Calidad</div>
      <h1 class="cover-title" style="border:none;color:#3b0764;text-align:center;">Automatización Integral de Pruebas del Proyecto Web: Habits UP</h1>
      <p class="cover-subtitle">Unitarias (Mocha/Chai/Sinon/c8) · API REST (Postman v2.1/Newman/DDT) · E2E POM &amp; IA (Playwright/MCP) · CI/CD (GitHub Actions) · Accesibilidad (axe-core) · Rendimiento (Lighthouse)</p>
    </div>

    <table class="cover-table">
      <tr><th>Integrantes</th><td>1. Jose Alfredo Maestre Manjarrez<br/>2. Ismael Jose Peñaloza Ortiz</td></tr>
      <tr><th>Docente</th><td>Ing. Esp. Amilkar Hernandez</td></tr>
      <tr><th>Proyecto Web Evaluado</th><td>Habits UP — Gestión y Seguimiento de Hábitos Personales</td></tr>
      <tr><th>Stack Tecnológico</th><td><strong>Frontend:</strong> React 19, Vite 8, React Router 7, Axios 1.13, Bootstrap 5.3<br/><strong>Backend:</strong> Node.js 20 LTS, Express 5.2, Mongoose 8.23, bcrypt 6.0, JWT HS256<br/><strong>Base de Datos:</strong> MongoDB (Atlas / <code>mongodb-memory-server</code> <code>habitsUp_Test</code>)</td></tr>
      <tr><th>URL del Repositorio</th><td>https://github.com/JAlfredoSoc/HabitsUp</td></tr>
      <tr><th>Pipeline CI/CD</th><td>https://github.com/JAlfredoSoc/HabitsUp/actions/workflows/tests.yml</td></tr>
      <tr><th>Fecha de Entrega</th><td>Noviembre de 2026 — Valledupar, Cesar, Colombia</td></tr>
    </table>

    <div class="cover-footer">
      Entregables 1 al 7 consolidados con evidencias verificables, reportes HTML y registro formal de defectos.
    </div>
  </section>

  <!-- ===================== 2. RESUMEN EJECUTIVO ===================== -->
  <h1>2. Resumen Ejecutivo</h1>
  <p>
    Este documento consolida la estrategia, automatización, ejecución y resultados de la suite de aseguramiento de calidad construida para la aplicación web <strong>Habits UP</strong>. Siguiendo la <strong>Pirámide de Pruebas</strong>, se verificaron de forma automática la lógica de negocio del backend, los contratos HTTP/JSON de la API REST, los flujos críticos de usuario en dos navegadores web reales, los criterios de accesibilidad WCAG 2.1 AA y las métricas de rendimiento web, integrando todo el ciclo en un pipeline de <strong>GitHub Actions</strong> ejecutable desde un clon limpio.
  </p>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-val">16 / 16</div>
      <div class="kpi-lbl">Unitarias (84.23% líneas)</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">530 / 530</div>
      <div class="kpi-lbl">Asserts API Newman (14ms)</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">41 / 41</div>
      <div class="kpi-lbl">Playwright E2E + IA + axe</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">100 / 97</div>
      <div class="kpi-lbl">Lighthouse Perf / A11y</div>
    </div>
  </div>

  <ul>
    <li><strong>Nivel Unitario (Entregable 2):</strong> 16 pruebas con <code>Mocha + Chai + Sinon + c8</code> sobre los módulos de Progreso (Strategy/Bridge/Proxy), Validación y Seguridad de Usuario (<code>bcrypt</code>) y Clonación/Adaptadores de Notificación. <strong>100% aprobadas</strong> con cobertura de <strong>84.23% de líneas</strong> (superando la meta del 75%).</li>
    <li><strong>Nivel API REST (Entregable 3):</strong> Colección Postman v2.1 con 25 requests en 5 carpetas, autenticación JWT automatizada con Pre-request global, CRUD completo encadenado de Usuarios y Hábitos, <strong>6 contratos JSON Schema</strong>, <strong>6 pruebas negativas 4xx</strong> (<code>400, 401, 403, 404, 409</code>) y Data Driven Testing (5 filas con <code>pm.iterationData.get()</code>). Resultado Newman: <strong>125 requests / 530 aserciones aprobadas (0 fallos)</strong> y promedio de <strong>14 ms</strong>.</li>
    <li><strong>Nivel E2E POM y Asistidas por IA (Entregables 4 y 5):</strong> 16 escenarios funcionales (13 en los 3 flujos críticos + 3 nuevos escenarios generados con <strong>Playwright MCP</strong> en <code>e2e/ia/</code>) + 4 auditorías <code>@axe-core/playwright</code>, sobre <strong>Chromium y Firefox</strong>, usando 6 Page Objects inyectados con <code>test.extend</code> y sesión reutilizable con <code>storageState</code>. Resultado: <strong>41/41 ejecuciones en verde</strong>.</li>
    <li><strong>Hallazgos y Defectos Corregidos (Entregables 6 y 7):</strong> Se detectaron <strong>5 defectos reales</strong> (1 bloqueo de clics CSS en <code>.tarjeta-bienvenida::after</code> y 4 violaciones WCAG 2.1 AA: <code>button-name</code>, <code>label</code>, <code>aria-progressbar-name</code> y <code>color-contrast</code>), los cuales fueron corregidos en el código fuente y re-verificados en verde.</li>
  </ul>

  <!-- ===================== 3. DESCRIPCIÓN DEL SISTEMA ===================== -->
  <h1>3. Descripción del Sistema</h1>
  <p>
    <strong>Habits UP</strong> permite a sus usuarios registrarse de forma segura, autenticarse, consultar categorías y sugerencias predefinidas, crear hábitos diarios/semanales/mensuales, registrar incrementos de progreso, editar, clonar (patrón <em>Prototype</em>), eliminar rutinas, actualizar su perfil y consultar su historial y estadísticas.
  </p>

  <pre><code>[ Navegador Web (Chromium / Firefox) ]
          │  HTTP / JSON (Axios)
          ▼
[ Frontend SPA: React 19 + Vite 8 + React Router 7 + Bootstrap 5 ]
          │  ├── EnrutadorPrincipal con RutaProtegida (/ y /panel-principal)
          │  ├── Modales: Login, Registro, Hábito y Perfil
          │  └── Fábrica UI de Tarjetas (HabitoUIFactory / Factory Selector)
          ▼  REST API + CORS + Authorization: Bearer &lt;JWT&gt;
[ API REST Backend: Node.js 20 + Express 5 + Mongoose 8 ]
          │  ├── Controladores: Usuario, Hábito, Progreso, Historial, Sugerencias
          │  ├── Patrones: Strategy/Bridge/Proxy (Progreso), Builder/Director/Prototype (Hábitos), Flyweight, Adapter
          │  └── Seguridad: ValidacionesUsuario (bcrypt) + JwtHelper (HS256)
          ▼
[ MongoDB (Atlas / MongoMemoryServer habitsUp_Test con semillas automáticas) ]</code></pre>

  <table class="data">
    <thead>
      <tr><th>Dimensión</th><th>Detalle en el Alcance</th><th>Fuera del Alcance Directo (Aislado con Dobles)</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Backend / Negocio</strong></td>
        <td>Validaciones de usuario, cifrado <code>bcrypt</code>, emisión/verificación JWT, CRUD encadenado de usuarios y hábitos, límites de progreso (Strategy/Proxy), clonación (Prototype), historial, estadísticas y semillas.</td>
        <td>Envío real de correos SMTP (<code>nodemailer</code>), notificaciones externas a Telegram Bot API y tareas programadas <code>node-cron</code> (mockeadas con <code>Sinon</code>).</td>
      </tr>
      <tr>
        <td><strong>Frontend / Calidad Web</strong></td>
        <td>Registro, login, guardia de ruta SPA, creación/edición/eliminación/clonación de hábitos, incremento de progreso, filtro y adopción de sugerencias, edición de perfil, accesibilidad WCAG 2.1 AA y rendimiento (LCP, CLS, TBT).</td>
        <td>Infraestructura de despliegue productivo externo y pruebas de carga distribuida a gran escala.</td>
      </tr>
    </tbody>
  </table>

  <!-- ===================== 4. ESTRATEGIA Y PLAN DE PRUEBAS ===================== -->
  <h1>4. Estrategia y Plan de Pruebas (Entregable 1)</h1>
  <h2>4.1. Pirámide de Pruebas Real y Niveles Aplicados</h2>
  <p>
    La estrategia se construyó sobre la Pirámide de Pruebas para equilibrar velocidad, costo de mantenimiento y cobertura real: una base rápida de pruebas unitarias aisladas, una capa robusta de validación de contratos HTTP y Data Driven Testing en API, y una cúspide selecta de escenarios E2E multi-navegador complementada con auditorías automáticas de accesibilidad y rendimiento.
  </p>

  <div style="text-align:center;margin:10px 0 14px;">
    <svg viewBox="0 0 680 175" width="100%" style="max-width:600px;background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;padding:8px;">
      <polygon points="175,15 235,62 115,62" fill="#7c3aed"/>
      <text x="175" y="48" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700" font-family="Arial">E2E + IA</text>
      <polygon points="110,66 240,66 285,112 65,112" fill="#6d28d9"/>
      <text x="175" y="94" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="700" font-family="Arial">API REST / Contratos</text>
      <polygon points="60,116 290,116 335,160 15,160" fill="#4c1d95"/>
      <text x="175" y="143" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700" font-family="Arial">Pruebas Unitarias</text>
      <text x="350" y="44" fill="#3b0764" font-size="11" font-weight="700" font-family="Arial">Playwright POM + MCP + axe-core:</text>
      <text x="350" y="59" fill="#475569" font-size="10" font-family="Arial">41 ejecuciones (Chromium + Firefox) — 100% OK</text>
      <text x="350" y="88" fill="#3b0764" font-size="11" font-weight="700" font-family="Arial">Postman v2.1 + Newman + DDT:</text>
      <text x="350" y="103" fill="#475569" font-size="10" font-family="Arial">25 req × 5 filas = 125 req / 530 asserts — 14 ms</text>
      <text x="350" y="135" fill="#3b0764" font-size="11" font-weight="700" font-family="Arial">Mocha + Chai + Sinon + c8:</text>
      <text x="350" y="150" fill="#475569" font-size="10" font-family="Arial">16 pruebas AAA — 84.23% cobertura de líneas</text>
    </svg>
  </div>

  <h2>4.2. Roles de Calidad en el Ciclo de Vida (SDLC)</h2>
  <table class="data">
    <thead>
      <tr><th>Integrante</th><th>Responsabilidad Principal</th><th>Participación en Etapas del SDLC</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Jose Alfredo Maestre Manjarrez</strong></td>
        <td>Plan de pruebas, pruebas unitarias y cobertura de código.</td>
        <td>Diseño de alcance y riesgos; automatización unitaria con Mocha/Chai/Sinon bajo AAA; medición de cobertura con <code>c8</code>; revisión cruzada de colección API; cierre de defectos de backend.</td>
      </tr>
      <tr>
        <td><strong>Ismael Jose Peñaloza Ortiz</strong></td>
        <td>Pruebas API REST (Postman/Newman) y pruebas E2E (Playwright POM + MCP).</td>
        <td>Diseño de colección v2.1, contratos JSON Schema y DDT; implementación de Page Objects, fixtures y escenarios E2E; revisión cruzada de unitarias; cierre de defectos de UI.</td>
      </tr>
      <tr>
        <td><strong>Equipo Conjunto</strong></td>
        <td>Integración Continua, Accesibilidad, Rendimiento e Informe Final.</td>
        <td>Configuración del workflow CI/CD en GitHub Actions; auditorías con <code>@axe-core/playwright</code> y Lighthouse; consolidación de defectos, evidencias y sustentación.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3. Riesgos Priorizados, Entornos y Política de Datos</h2>
  <table class="data">
    <thead>
      <tr><th>ID</th><th>Riesgo Identificado</th><th>Prioridad</th><th>Mitigación Automatizada</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>R-01</strong></td><td>Exposición de contraseñas o consulta no autorizada de perfiles ajenos</td><td><span class="badge-high">Crítica</span></td><td>Hash <code>bcrypt</code>, validación JSON Schema sin campo <code>contrasena</code>, pruebas <code>401/403</code> en API y guardia <code>RutaProtegida</code> (<code>CP-41</code>).</td></tr>
      <tr><td><strong>R-02</strong></td><td>Superación del límite de progreso o pérdida de datos al editar/clonar</td><td><span class="badge-high">Alta</span></td><td>Pruebas de valores límite en <code>ProgresoProxy</code> (<code>CP-05/06</code>), API (<code>CP-30/31/32</code>) y persistencia E2E tras F5 (<code>CP-44</code>).</td></tr>
      <tr><td><strong>R-03</strong></td><td>Bloqueos visuales de interacción o regresiones entre navegadores</td><td><span class="badge-high">Alta</span></td><td>Ejecución multi-navegador en Chromium y Firefox (permitió detectar y corregir <code>DEF-01</code>).</td></tr>
      <tr><td><strong>R-04</strong></td><td>Incumplimiento de criterios de accesibilidad WCAG 2.1 AA</td><td><span class="badge-med">Media</span></td><td>Pruebas bloqueantes con <code>@axe-core/playwright</code> (0 violaciones <code>critical/serious</code>) y Lighthouse (detectó <code>DEF-02</code> a <code>DEF-05</code>).</td></tr>
    </tbody>
  </table>

  <div class="callout">
    <strong>Entornos y limpieza automatizada:</strong> El backend se levanta en <code>http://localhost:3000</code> y el frontend en <code>http://localhost:5173</code>. Si no se provee <code>MONGO_URI</code> externo, <code>Back/src/config/db.js</code> levanta automáticamente <code>MongoMemoryServer</code> con base aislada <code>habitsUp_Test</code> y siembra las 6 categorías (<code>Salud, Bienestar, Estudio, Productividad, Trabajo, Relaciones</code>) y 3 sugerencias base (<code>Beber 2L de agua, Lectura diaria, Meditación</code>). Todos los usuarios usan correos únicos <code>@example.test</code> y se limpian en cascada con <code>DELETE /usuario/:id</code>.
  </div>

  <!-- ===================== 5. DISEÑO DE CASOS DE PRUEBA ===================== -->
  <h1>5. Diseño de Casos de Prueba y Trazabilidad</h1>
  <p>
    Aplicando <strong>Partición de Equivalencia (PE)</strong>, <strong>Análisis de Valores Límite (AVL)</strong>, <strong>Transición de Estados</strong> y <strong>Pruebas Basadas en Casos de Uso (CU)</strong>, se diseñaron y automatizaron <strong>54 escenarios trazables</strong> a los requisitos funcionales y no funcionales (la matriz detallada completa se presenta en el <strong>Anexo A</strong>):
  </p>
  <table class="data">
    <thead>
      <tr><th>Nivel</th><th>Rango de Casos</th><th>Diseñados</th><th>Ejecuciones Automatizadas</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr><td>Unitarias (Mocha + Chai + Sinon)</td><td><code>CP-01</code> a <code>CP-15</code> (+ tel.)</td><td>16</td><td>16 pruebas (100% AAA)</td><td><span class="badge-pass">100% Aprobado</span></td></tr>
      <tr><td>API REST, Contratos y DDT (Newman)</td><td><code>CP-16</code> a <code>CP-36</code> (+ stats/hist.)</td><td>25 requests</td><td>125 requests / 530 asserts (5 iter. DDT)</td><td><span class="badge-pass">100% Aprobado</span></td></tr>
      <tr><td>E2E POM en 3 Flujos (Playwright)</td><td><code>CP-37</code> a <code>CP-47</code> (+ 3 DDT)</td><td>13 escenarios</td><td>27 ejecuciones (setup + 13×2 nav.)</td><td><span class="badge-pass">100% Aprobado</span></td></tr>
      <tr><td>E2E Asistidas por IA (Playwright MCP)</td><td><code>IA-01</code> a <code>IA-03</code></td><td>3 escenarios</td><td>6 ejecuciones (3×2 nav.)</td><td><span class="badge-pass">100% Aprobado</span></td></tr>
      <tr><td>Accesibilidad y Rendimiento Web</td><td><code>A11Y-01..04</code> + 3 Lighthouse</td><td>7 auditorías</td><td>8 axe-core + 3 Lighthouse</td><td><span class="badge-pass">100% Aprobado</span></td></tr>
    </tbody>
  </table>

  <!-- ===================== 6. PRUEBAS UNITARIAS ===================== -->
  <h1 class="page-break">6. Pruebas Unitarias, Mocking, TDD y Cobertura (Entregable 2)</h1>
  <p>
    La suite unitaria se construyó con <strong>Mocha 12</strong>, <strong>Chai 6</strong>, <strong>Sinon 22</strong> para dobles de prueba (stubs y spies) y <strong>c8 12</strong> para medición de cobertura sobre 3 módulos de negocio reales: <code>progreso.test.js</code> (estrategias diaria/semanal/mensual, <code>ProgresoBridge</code> y <code>ProgresoProxy</code>), <code>usuarioValidacion.test.js</code> (reglas de email, longitud límite de contraseña 5 vs. 6, edad, teléfono y hashing <code>bcrypt</code>) y <code>habitoNotificacion.test.js</code> (esquema Mongoose, clonación con reinicio de progreso y adaptadores <code>EmailAdapter</code> / <code>TelegramAdapter</code> aislados).
  </p>

  <h3>Ejemplo de Prueba con Estructura AAA y Aislamiento mediante Stub + Spy (Sinon)</h3>
  <pre><code>// CP-06: Bloquear incremento cuando el límite fue alcanzado (Back/test/unit/services/progreso.test.js)
it("CP-06: Debe bloquear el incremento y lanzar error cuando ya se alcanzó el límite", async () => {
  // Arrange
  const proxy = new ProgresoProxy();
  const mockProgreso = { habito: "habito123", periodo: "diario", frecuencia: 3, progreso: 3 };
  sinon.stub(Progreso, "findOne").resolves(mockProgreso);
  const serviceSpy = sinon.spy(proxy.service, "actualizar");

  // Act & Assert
  try {
    await proxy.actualizar("habito123", "usuario001");
    expect.fail("Debería haber lanzado un error");
  } catch (error) {
    expect(error.message).to.equal("El hábito ya está completado");
    expect(serviceSpy.called).to.be.false;
  }
});</code></pre>

  <p>
    <strong>Evidencia de commits y cobertura:</strong> Los commits consecutivos <code>9979575</code> (<em>Entregable 2 Pruebas unitarias</em>), <code>0b83141</code> (<em>Entregable 2 Medicion cobertura</em>) y <code>4423a6b</code> (<em>Arreglos y refactorización de validaciones</em>) evidencian la evolución de la suite hasta alcanzar <strong>84.23% de cobertura de líneas</strong> (superando la meta del 75%), con 100% en modelos, 96.72% en adaptadores, 94.44% en <code>ProgresoProxy</code> y 91.22% en estrategias de progreso.
  </p>

  ${figureBlock('01_consola_unitarias_cobertura.png', 'Figura 1. Ejecución por consola de las 16 pruebas unitarias y tabla de cobertura c8 (84.23% de líneas).')}
  ${figureBlock('02_reporte_cobertura_html.png', 'Figura 2. Reporte HTML interactivo de cobertura de código generado con c8 en reports/coverage/index.html.')}

  <!-- ===================== 7. PRUEBAS DE API REST ===================== -->
  <h1 class="page-break">7. Pruebas de API REST con Postman y Newman (Entregable 3)</h1>
  <p>
    Se diseñó y exportó en formato oficial <strong>Postman Collection v2.1</strong> el archivo <code>Back/postman/HabitsUp.postman_collection.json</code> junto con su environment sin credenciales reales (<code>HabitsUp.postman_environment.json</code>) y el archivo de datos DDT (<code>ddt_habitos.json</code>, 5 filas).
  </p>
  <ul>
    <li><strong>Organización en 5 carpetas:</strong> <code>1. Estado y Catalogos</code>, <code>2. Usuarios (CRUD Encadenado y Autenticacion)</code>, <code>3. Habitos y Progreso (CRUD Encadenado)</code>, <code>4. Negativos (Familia 4xx)</code> y <code>5. Data Driven Testing y Cierre CRUD</code>.</li>
    <li><strong>Autenticación automatizada:</strong> <code>CP-22 (POST /IniciarSesion)</code> emite un token JWT firmado (<code>JwtHelper</code>) y lo almacena en <code>authToken</code>; el <strong>Pre-request Script a nivel de colección</strong> inyecta <code>Authorization: Bearer {{authToken}}</code> automáticamente en todas las peticiones subsecuentes.</li>
    <li><strong>CRUD encadenado de 2 recursos (25 requests):</strong> <code>usuarioId</code> creado en <code>POST /RegistroUsuario</code> alimenta <code>GET /usuario/:id</code>, <code>PUT /EditarUsuario/:id</code>, <code>POST /CrearHabitos</code> y <code>DELETE /usuario/:id</code>; análogamente, <code>habitoId</code> creado en <code>POST /CrearHabitos</code> se encadena en <code>GET /habito/:id</code>, <code>GET /ObtenerHabitos/:usuarioID</code>, <code>PUT /ActualizarProgreso/:habitoId</code>, <code>POST /clonar/:habitoId</code>, <code>PUT /editar/:habitoId</code> y <code>DELETE /eliminar/:habitoId</code>.</li>
    <li><strong>6 Validaciones de contrato JSON Schema:</strong> Aplicadas con <code>pm.response.to.have.jsonSchema(...)</code> en <code>CP-17</code>, <code>CP-19</code>, <code>CP-22</code>, <code>CP-24</code>, <code>CP-28</code> y <code>GET /habito/:id</code>.</li>
    <li><strong>Escenarios Negativos (5 códigos 4xx distintos):</strong> <code>400</code> (<code>CP-20</code>), <code>401</code> (<code>CP-23</code> y <code>CP-25</code> sin token), <code>403</code> (<code>CP-26</code> acceso a perfil ajeno), <code>404</code> (<code>CP-34</code> hábito inexistente/eliminado) y <code>409</code> (<code>CP-21</code> correo duplicado), sin ninguna respuesta <code>5xx</code>.</li>
    <li><strong>Data Driven Testing y Rendimiento:</strong> <code>CP-36</code> lee 5 combinaciones de hábitos desde <code>ddt_habitos.json</code> con <code>pm.iterationData.get()</code>. Cada uno de los 25 requests valida código de estado, <code>Content-Type</code>, valores del body y umbral de tiempo de respuesta (<code>&lt; 500 ms</code> en lecturas y <code>&lt; 1000 ms</code> en escrituras).</li>
  </ul>

  ${figureBlock('03_consola_api_newman.png', 'Figura 3. Ejecución en terminal con Newman (npm run test:api): 5 iteraciones, 125 requests, 530 aserciones, 0 fallos y promedio 14 ms.')}
  ${figureBlock('04_reporte_newman_htmlextra.png', 'Figura 4. Reporte HTML generado por newman-reporter-htmlextra en reports/newman/habitsup-api-report.html.')}
  ${figureBlock('05_postman_runner_530.jpg', 'Figura 5. Evidencia en vivo desde Postman Collection Runner con ddt_habitos.json: 530/530 pruebas aprobadas en 5 iteraciones.')}

  <!-- ===================== 8. PRUEBAS E2E PLAYWRIGHT ===================== -->
  <h1 class="page-break">8. Pruebas E2E con Playwright y Page Object Model (Entregable 4)</h1>
  <p>
    La suite E2E se implementó en la carpeta <code>e2e/</code> configurada en <code>playwright.config.js</code> con <code>baseURL: 'http://localhost:5173'</code>, <code>testIdAttribute: 'data-testid'</code>, <code>screenshot: 'only-on-failure'</code>, <code>trace: 'on-first-retry'</code>, reporte HTML en <code>reports/playwright/</code>, <code>webServer</code> dual (Backend + Frontend) y ejecución sobre <strong>2 navegadores: Chromium y Firefox</strong>.
  </p>

  <h2>8.1. Arquitectura Page Object Model (6 Page Objects + Fixtures + storageState)</h2>
  <ul>
    <li><strong>Login reutilizable (<code>storageState</code>):</strong> El proyecto <code>setup</code> (<code>e2e/auth.setup.js</code>) registra e inicia sesión una única vez y persiste el estado en <code>e2e/.auth/user.json</code>, inyectado automáticamente a <code>chromium</code> y <code>firefox</code>.</li>
    <li><strong>6 Page Objects en <code>e2e/pages/</code>:</strong> <code>LandingPage</code>, <code>RegisterPage</code>, <code>LoginPage</code>, <code>DashboardPage</code>, <code>HabitoFormPage</code> y <code>ProfileModalPage</code>, inyectados mediante <code>test.extend</code> en <code>e2e/fixtures/testFixtures.js</code>.</li>
    <li><strong>Reglas estrictas verificadas:</strong> 100% estructura <code>// Arrange, // Act, // Assert</code>; cero locators directos en archivos <code>.spec.js</code>; cero aserciones dentro de los Page Objects; cero <code>waitForTimeout</code>, selectores CSS, XPath o <code>.nth()</code>; selección en listas mediante <code>.filter({ hasText })</code>.</li>
    <li><strong>3 Flujos Críticos Automatizados:</strong> <code>flujo1-autenticacion.spec.js</code> (<code>CP-37</code> negativo, <code>CP-38/39</code>, <code>CP-40</code> negativo, <code>CP-41</code> guardia de ruta), <code>flujo2-habitos-crud.spec.js</code> (<code>CP-42</code>, <code>CP-43</code> negativo, <strong>DDT con 3 casos</strong>, <code>CP-45</code> edición, <code>CP-46</code> eliminación persistente) y <code>flujo3-progreso-sugerencias.spec.js</code> (<code>CP-44</code> progreso 0%→50% persistente tras F5 y <code>CP-47</code> adopción de sugerencia).</li>
  </ul>

  <h2>8.2. Ubicación de Atributos <code>data-testid</code> Agregados al Frontend</h2>
  <table class="data">
    <thead>
      <tr><th>Componente Frontend</th><th>Atributos <code>data-testid</code> Agregados</th><th>Uso en Page Objects</th></tr>
    </thead>
    <tbody>
      <tr><td><code>BarraNavegacion.jsx</code></td><td><code>nav-btn-login</code>, <code>nav-btn-registro</code></td><td>Apertura de modales en <code>LandingPage</code>.</td></tr>
      <tr><td><code>ModalInicioSesion.jsx</code></td><td><code>modal-login</code>, <code>login-alert-error</code></td><td>Formulario de acceso y verificación de alertas <code>401</code>.</td></tr>
      <tr><td><code>ModalRegistroUsuario.jsx</code></td><td><code>modal-registro</code>, <code>registro-alert-error</code>, <code>registro-alert-exito</code></td><td>Validación de errores y confirmación en <code>RegisterPage</code>.</td></tr>
      <tr><td><code>BarraSuperiorPanel.jsx</code> y <code>BarraLateralPanel.jsx</code></td><td><code>usuario-nombre-header</code>, <code>btn-cerrar-sesion</code>, <code>nav-menu-*</code></td><td>Verificación de usuario logueado, navegación lateral y logout.</td></tr>
      <tr><td><code>ModalHabito.jsx</code></td><td><code>modal-habito</code>, <code>error-habito-nombre/descripcion/categoria/periodo/frecuencia/horario</code></td><td>Validación por campo en escenario negativo <code>CP-43</code>.</td></tr>
      <tr><td><code>HabitoUIFactory.js</code>, <code>HabitoCard.jsx</code>, <code>TarjetaSugerencia.jsx</code>, <code>SeccionSugerencias.jsx</code>, <code>ModalPerfil.jsx</code></td><td><code>tarjeta-habito</code>, <code>habito-progreso-texto</code>, <code>tarjeta-sugerencia</code>, <code>select-filtro-categoria-sugerencias</code>, <code>modal-perfil</code></td><td>Selección en listas con <code>filter({ hasText })</code>, verificación de progreso, filtrado y edición de perfil.</td></tr>
    </tbody>
  </table>

  ${figureBlock('06_consola_playwright_lighthouse.png', 'Figura 6. Resumen de consola de la suite completa Playwright (41/41 en Chromium y Firefox) y Google Lighthouse.')}
  ${figureBlock('07_reporte_playwright_html.png', 'Figura 7. Reporte HTML oficial de Playwright (reports/playwright/index.html) con 41/41 ejecuciones aprobadas.')}

  <!-- ===================== 9. PRUEBAS ASISTIDAS POR IA ===================== -->
  <h1 class="page-break">9. Pruebas E2E Asistidas por IA con Playwright MCP (Entregable 5)</h1>
  <p>
    Se configuró el servidor <strong>Playwright MCP</strong> en <code>.vscode/mcp.json</code> (<code>@playwright/mcp@latest</code>) para inspeccionar el árbol de accesibilidad vivo y generar <strong>3 pruebas E2E adicionales</strong> no cubiertas en el Entregable 4, ubicadas en <code>e2e/ia/pruebas-asistidas-ia.spec.js</code> (documentación íntegra en <code>Entregable_5_Pruebas_E2E_Asistidas_IA.md</code>):
  </p>
  <ol>
    <li><strong><code>IA-01</code> (Clonación con Prototype):</strong> Crea un hábito diario, lo completa al <code>100%</code>, ejecuta la acción <em>Clonar</em> y verifica que la copia <code>(copia)</code> aparece con progreso reiniciado en <code>0%</code> mientras el original conserva <code>100%</code>.</li>
    <li><strong><code>IA-02</code> (Edición de Perfil):</strong> Abre <em>Mi Perfil</em> desde la barra superior, activa <em>Editar Perfil</em>, actualiza nombre y teléfono, guarda y verifica sincronización inmediata y persistencia tras recargar.</li>
    <li><strong><code>IA-03</code> (Filtro de Sugerencias y Logout):</strong> Filtra las sugerencias por categoría <code>Estudio</code> verificando presencia de <code>Lectura diaria</code> y exclusión de <code>Meditación</code> (<code>toHaveCount(0)</code>), y cierra sesión comprobando redirección a <code>/</code>.</li>
  </ol>

  <h2>9.1. Ejemplo Comparativo: Prompt, Código Generado Sin Editar vs. Código Final Revisado (IA-01)</h2>
  <div class="callout">
    <strong>Prompt Estructurado (Rol, Contexto, Tarea, Restricciones, Formato):</strong> <em>"Actúa como Ingeniero Senior QA experto en Playwright y POM. En Habits UP (<code>/panel-principal</code>), las tarjetas (<code>tarjeta-habito</code>) exponen los botones Completar y Clonar (patrón Prototype con sufijo <code>(copia)</code> y progreso 0%). Genera una prueba E2E que complete un hábito al 100%, lo clone y verifique que la copia queda en 0% y el original en 100%. Restricciones: AAA obligatorio, prohibido waitForTimeout, CSS, XPath o nth(); usa filter({ hasText }) y fixtures POM. Formato: bloque JS para @playwright/test."</em>
  </div>

  <pre><code>// CÓDIGO GENERADO POR LA IA SIN EDITAR (defectos: waitForTimeout, CSS frágil, .first()/.nth(1), sin POM)
await page.locator('input[name="nombre"]').fill('Meditación Mindfulness IA');
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(2000);
const cardOriginal = page.locator('.tarjeta-habito').first();
await cardOriginal.locator('button:has-text("Clonar")').click();
await page.waitForTimeout(1500);
const cardCopia = page.locator('.tarjeta-habito').nth(1);

// CÓDIGO FINAL REVISADO EN e2e/ia/pruebas-asistidas-ia.spec.js (POM + web-first + filtro exacto)
await habitoFormPage.crearHabito({ nombre: nombreBase, descripcion: '...', categoria: 'Bienestar', periodo: 'diario', frecuencia: '1', horario: '21:30' });
await dashboardPage.completarHabito(nombreBase);
await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreBase)).toHaveText('100%');
await dashboardPage.clonarHabito(nombreBase);
await expect(dashboardPage.obtenerTarjetaHabito(nombreCopiaEsperado)).toBeVisible();
await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreCopiaEsperado)).toHaveText('0%');
await expect(dashboardPage.obtenerTextoProgresoDeHabito(nombreBase)).toHaveText('100%');</code></pre>

  <h2>9.2. Tabla de Revisión Crítica (Human-in-the-Loop)</h2>
  <table class="data">
    <thead>
      <tr><th>Escenario</th><th>¿Qué hizo bien la IA?</th><th>¿Qué se tuvo que corregir?</th><th>¿Por qué fue necesaria la corrección?</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>IA-01 (Clonación)</strong></td>
        <td>Capturó bien el flujo funcional (crear → 100% → clonar → 0%) y bloques AAA.</td>
        <td>Eliminó 3 <code>waitForTimeout</code>, CSS directos y <code>.first()/.nth(1)</code>; añadió coincidencia exacta de encabezado en <code>DashboardPage</code>.</td>
        <td>Evita <em>flakiness</em> y resuelve una violación real de <em>Strict Mode</em> porque <code>nombreBase</code> es subcadena de <code>nombreBase (copia)</code>.</td>
      </tr>
      <tr>
        <td><strong>IA-02 (Perfil)</strong></td>
        <td>Identificó el clic previo en <code>"Editar Perfil"</code> para desbloquear los inputs.</td>
        <td>Corrigió el dato inventado con dígitos (<code>'... 2026'</code> → <code>'... Editado'</code>); cambió <code>textContent()</code> por <code>toHaveText()</code>; creó <code>ProfileModalPage</code>.</td>
        <td><code>ModalPerfil.jsx</code> filtra números del campo <code>nombre</code> con regex; las aserciones <em>web-first</em> reintentan automáticamente y respetan el POM.</td>
      </tr>
      <tr>
        <td><strong>IA-03 (Filtro y Logout)</strong></td>
        <td>Combinó selección por etiqueta <code>'Estudio'</code> con verificación de redirección al cerrar sesión.</td>
        <td>Reemplazó <code>.menu-lateral-btn.nth(3)</code> por <code>getByTestId('nav-menu-sugerencias')</code> y agregó aserción negativa <code>toHaveCount(0)</code> sobre <code>'Meditación'</code>.</td>
        <td>Un índice posicional se rompe si cambia el menú, y un filtro solo se valida probando inclusión y exclusión simultáneamente.</td>
      </tr>
    </tbody>
  </table>
  <p>
    <strong>Reflexión sobre cuándo conviene usar IA:</strong> La IA con Playwright MCP aporta gran valor para descubrir escenarios no cubiertos y acelerar el borrador inicial, pero siempre debe operarse bajo enfoque <em>Human-in-the-Loop</em>: el ingeniero QA es indispensable para asegurar arquitectura POM, eliminar esperas fijas, respetar reglas de validación del dominio y construir aserciones sólidas.
  </p>

  <!-- ===================== 10. RESULTADOS, MÉTRICAS, CI/CD, RENDIMIENTO Y ACCESIBILIDAD ===================== -->
  <h1 class="page-break">10. Resultados, Métricas, CI/CD, Rendimiento y Accesibilidad (Entregable 6)</h1>

  <h2>10.1. Tabla Consolidada de Resultados por Nivel (Métricas Reales)</h2>
  <table class="data">
    <thead>
      <tr><th>Nivel / Suite</th><th>Herramienta</th><th>Totales</th><th>Aprobadas</th><th>Fallidas</th><th>Omitidas</th><th>Cobertura / Métrica Clave</th><th>Tiempo</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Unitarias</strong></td><td>Mocha + Chai + Sinon + c8</td><td>16</td><td><strong>16</strong></td><td>0</td><td>0</td><td><strong>84.23% líneas</strong> / 82.60% funcs</td><td>224 ms</td></tr>
      <tr><td><strong>API REST + DDT</strong></td><td>Postman v2.1 + Newman</td><td>125 req (530 asserts)</td><td><strong>125</strong> (530)</td><td>0</td><td>0</td><td><strong>6 JSON Schema</strong> / prom. 14 ms</td><td>12.4 s</td></tr>
      <tr><td><strong>E2E (POM + DDT)</strong></td><td>Playwright (2 navegadores)</td><td>27 (setup + 13×2)</td><td><strong>27</strong></td><td>0</td><td>0</td><td><strong>100%</strong> (6 Page Objects)</td><td>~2.1 min</td></tr>
      <tr><td><strong>E2E Asistidas IA</strong></td><td>Playwright MCP (<code>e2e/ia/</code>)</td><td>6 (3×2 nav.)</td><td><strong>6</strong></td><td>0</td><td>0</td><td><strong>100%</strong> (revisión crítica)</td><td>~20 s</td></tr>
      <tr><td><strong>Accesibilidad</strong></td><td><code>@axe-core/playwright</code></td><td>8 (4 vistas×2 nav.)</td><td><strong>8</strong></td><td>0</td><td>0</td><td><strong>0 violaciones</strong> critical/serious</td><td>~14 s</td></tr>
      <tr><td><strong>Rendimiento Web</strong></td><td>Google Lighthouse CLI</td><td>3 páginas clave</td><td><strong>3</strong></td><td>0</td><td>0</td><td><strong>100/100 Perf</strong> | <strong>97/100 A11y</strong></td><td>~28 s</td></tr>
      <tr><td colspan="2"><strong>TOTAL CONSOLIDADO</strong></td><td><strong>185 ejecuciones</strong></td><td><strong>185 (100%)</strong></td><td><strong>0</strong></td><td><strong>0</strong></td><td><strong>100% Cumplimiento RAA1–RAA5</strong></td><td><strong>~3.3 min</strong></td></tr>
    </tbody>
  </table>

  <h2>10.2. Pipeline CI/CD en GitHub Actions (<code>.github/workflows/tests.yml</code>)</h2>
  <p>
    El pipeline se dispara en cada <code>push</code> y <code>pull_request</code> hacia <code>main</code> y está dividido en <strong>3 etapas secuenciales dependientes</strong> (<code>unit-tests</code> → <code>api-tests [needs: unit-tests]</code> → <code>e2e-and-accessibility-tests [needs: api-tests]</code>): si cualquier etapa falla, el workflow queda en rojo y bloquea la ejecución de las siguientes. Publica 5 artefactos descargables (<code>report-unit-coverage</code>, <code>report-newman-htmlextra</code>, <code>report-playwright-e2e</code>, <code>report-accessibility-axe</code> y <code>report-lighthouse</code>), protege las credenciales mediante <code>\${{ secrets.MONGO_URI }}</code> y <code>\${{ secrets.JWT_SECRET }}</code>, y expone su badge de estado en el <code>README.md</code>.
  </p>

  <h2>10.3. Auditoría de Rendimiento (Google Lighthouse) y Accesibilidad (<code>@axe-core/playwright</code>)</h2>
  <table class="data">
    <thead>
      <tr><th>Página Clave Evaluada</th><th>Rendimiento (Meta &ge; 70)</th><th>Accesibilidad Lighthouse</th><th>Violaciones axe-core (Critical/Serious)</th><th>LCP</th><th>CLS</th><th>TBT</th></tr>
    </thead>
    <tbody>
      <tr><td>1. Página Principal / Landing (<code>/</code>)</td><td><strong>100 / 100</strong></td><td><strong>97 / 100</strong></td><td><strong>0</strong></td><td>0.5 s</td><td>0.002</td><td>0 ms</td></tr>
      <tr><td>2. Panel Principal — Mis Hábitos (<code>/panel-principal</code>)</td><td><strong>100 / 100</strong></td><td><strong>97 / 100</strong></td><td><strong>0</strong></td><td>0.4 s</td><td>0.002</td><td>0 ms</td></tr>
      <tr><td>3. Catálogo de Sugerencias (<code>/panel-principal?vista=sugerencias</code>)</td><td><strong>100 / 100</strong></td><td><strong>97 / 100</strong></td><td><strong>0</strong></td><td>0.5 s</td><td>0.002</td><td>0 ms</td></tr>
    </tbody>
  </table>

  ${figureBlock('08_reporte_axe_accesibilidad.png', 'Figura 8. Reporte de accesibilidad automatizada @axe-core/playwright (reports/accessibility/axe-report.html): 0 violaciones critical/serious.')}
  ${figureBlock('09_reporte_lighthouse_resumen.png', 'Figura 9. Resumen consolidado de métricas de rendimiento y accesibilidad Google Lighthouse (reports/lighthouse/index.html).')}
  ${figureBlock('10_reporte_lighthouse_detalle.png', 'Figura 10. Reporte detallado oficial de Google Lighthouse sobre la página principal (Rendimiento 100, Accesibilidad 97).')}

  <!-- ===================== 11. REGISTRO DE DEFECTOS ===================== -->
  <h1 class="page-break">11. Registro de Defectos Encontrados (Entregable 7)</h1>
  <p>
    Las pruebas automatizadas detectaron <strong>5 defectos reales</strong> en el código de la aplicación (1 defecto funcional de interacción CSS y 4 violaciones de accesibilidad WCAG 2.1 AA). Todos fueron documentados, corregidos directamente en el código fuente y verificados pasando en verde con las mismas pruebas:
  </p>
  <table class="data">
    <thead>
      <tr><th>ID</th><th>Título del Defecto</th><th>Sev.</th><th>Prio.</th><th>Pasos para reproducir / Esperado vs. Obtenido</th><th>Evidencia y Prueba que lo detectó</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>DEF-01</strong></td>
        <td>Pseudo-elemento <code>.tarjeta-bienvenida::after</code> intercepta clics en botón <em>"Nuevo hábito"</em></td>
        <td><span class="badge-high">Alta</span></td>
        <td><span class="badge-high">Alta</span></td>
        <td><strong>Pasos:</strong> Iniciar sesión en <code>/panel-principal</code> y pulsar <code>Nuevo hábito</code>.<br/><strong>Esperado:</strong> Abre <code>ModalHabito</code>.<br/><strong>Obtenido:</strong> El pseudo-elemento decorativo bloqueaba los eventos de puntero generando timeout de 30s.<br/><strong>Fix:</strong> Se añadió <code>pointer-events: none;</code> en <code>Front/src/styles/general.css</code>.</td>
        <td><code>flujo2-habitos-crud.spec.js</code> (<code>CP-42, CP-43, CP-45, CP-46</code>) y <code>CP-44</code>. Re-verificado 41/41 en verde.</td>
        <td><span class="badge-pass">Corregido y Verificado</span></td>
      </tr>
      <tr>
        <td><strong>DEF-02</strong></td>
        <td>Regla <code>button-name</code>: Botón de notificaciones sin nombre accesible</td>
        <td><span class="badge-high">Crítica</span></td>
        <td><span class="badge-high">Alta</span></td>
        <td><strong>Pasos:</strong> Auditar <code>/panel-principal</code> con axe-core.<br/><strong>Esperado:</strong> Todo botón tiene texto o <code>aria-label</code>.<br/><strong>Obtenido:</strong> Botón <code>&lt;FiBell /&gt;</code> en <code>BarraSuperiorPanel.jsx</code> carecía de nombre accesible.<br/><strong>Fix:</strong> Se añadió <code>aria-label="Notificaciones"</code> y <code>title</code>.</td>
        <td><code>e2e/accesibilidad.spec.js</code> (<code>A11Y-03</code>) y reporte axe-core.</td>
        <td><span class="badge-pass">Corregido y Verificado</span></td>
      </tr>
      <tr>
        <td><strong>DEF-03</strong></td>
        <td>Regla <code>label</code>: Inputs de buscador y modales sin etiqueta asociada</td>
        <td><span class="badge-high">Crítica</span></td>
        <td><span class="badge-high">Alta</span></td>
        <td><strong>Pasos:</strong> Auditar formularios en <code>/panel-principal</code>.<br/><strong>Esperado:</strong> Todo input/select/textarea tiene <code>label htmlFor</code> o <code>aria-label</code>.<br/><strong>Obtenido:</strong> El buscador y campos de <code>ModalHabito</code> / <code>ModalPerfil</code> carecían de asociación explícita.<br/><strong>Fix:</strong> Se asociaron <code>htmlFor/id</code> y <code>aria-label</code>.</td>
        <td><code>e2e/accesibilidad.spec.js</code> (<code>A11Y-03, A11Y-04</code>) y Playwright <code>getByLabel</code>.</td>
        <td><span class="badge-pass">Corregido y Verificado</span></td>
      </tr>
      <tr>
        <td><strong>DEF-04</strong></td>
        <td>Regla <code>aria-progressbar-name</code>: Barras de progreso sin nombre accesible</td>
        <td><span class="badge-med">Media</span></td>
        <td><span class="badge-med">Media</span></td>
        <td><strong>Pasos:</strong> Renderizar tarjetas de hábito y ejecutar axe-core.<br/><strong>Esperado:</strong> Elementos <code>role="progressbar"</code> tienen <code>aria-label</code>.<br/><strong>Obtenido:</strong> <code>HabitoCard.jsx</code> y <code>TarjetaHabito.jsx</code> omitían <code>aria-label</code>.<br/><strong>Fix:</strong> Se agregó <code>aria-label={"Progreso de " + habito.nombre}</code>.</td>
        <td><code>e2e/accesibilidad.spec.js</code> (<code>A11Y-03</code>).</td>
        <td><span class="badge-pass">Corregido y Verificado</span></td>
      </tr>
      <tr>
        <td><strong>DEF-05</strong></td>
        <td>Regla <code>color-contrast</code>: Contraste insuficiente en badges de categoría (3.45:1 y 3.89:1) y footer (4.08:1)</td>
        <td><span class="badge-med">Media</span></td>
        <td><span class="badge-med">Media</span></td>
        <td><strong>Pasos:</strong> Auditar <code>/panel-principal</code> y <code>Sugerencias</code> en Chromium y Firefox.<br/><strong>Esperado:</strong> Contraste WCAG AA &ge; 4.5:1.<br/><strong>Obtenido:</strong> <code>.etiqueta-categoria</code> (<code>categoria-general</code> 3.45:1, <code>categoria-bienestar</code> 3.89:1) y <code>PiePagina.jsx</code> (4.08:1) no cumplían.<br/><strong>Fix:</strong> Se oscurecieron los textos de todas las categorías en <code>general.css</code> (&ge; 6.8:1) y el pie de página.</td>
        <td><code>e2e/accesibilidad.spec.js</code> (<code>A11Y-03</code> en Firefox y <code>A11Y-04</code> en Chromium). Re-verificado en verde.</td>
        <td><span class="badge-pass">Corregido y Verificado</span></td>
      </tr>
    </tbody>
  </table>

  <!-- ===================== 12. CONCLUSIONES Y DECLARACIÓN IA ===================== -->
  <h1>12. Conclusiones, Declaración de Uso de IA y Lecciones Aprendidas</h1>
  <ul>
    <li><strong>Impacto real sobre la calidad de Habits UP:</strong> La automatización de extremo a extremo dejó de ser un ejercicio teórico y generó mejoras directas en el producto: se aseguró la API con autenticación JWT y códigos 4xx correctos, se agregó protección de rutas privadas en React, se eliminó un bloqueo real de clics CSS (<code>DEF-01</code>) y se resolvieron 4 barreras de accesibilidad WCAG 2.1 AA (<code>DEF-02</code> a <code>DEF-05</code>).</li>
    <li><strong>Ejecución reproducible desde clon limpio:</strong> La incorporación de <code>mongodb-memory-server</code> con sembrado automático y <code>webServer</code> dual en Playwright permite que cualquier integrante o el docente ejecute todas las suites sin configurar bases de datos ni credenciales externas.</li>
    <li><strong>Declaración de uso de IA (Sección 6):</strong> Se utilizó IA explícitamente en el <strong>Entregable 5</strong> (Playwright MCP) para generar los borradores iniciales de <code>IA-01</code>, <code>IA-02</code> e <code>IA-03</code> (posteriormente corregidos y adaptados al POM), y como soporte de ingeniería para estructurar esquemas JSON Schema, scripts de orquestación y maquetación del informe. Todo el código entregado fue verificado, ejecutado y dominado por el equipo.</li>
    <li><strong>Trabajo futuro:</strong> Incorporar pruebas de carga y estrés con <code>k6</code> y ambientes de staging desplegados automáticamente por cada Pull Request.</li>
  </ul>

  <!-- ===================== 13. REFERENCIAS Y ANEXOS ===================== -->
  <h1 class="page-break">13. Referencias y Anexos</h1>
  <h2>13.1. Fuentes Consultadas</h2>
  <ul>
    <li>Playwright Official Documentation — Page Object Model, Fixtures &amp; Auth (<code>storageState</code>): <em>https://playwright.dev/docs/pom</em></li>
    <li>Postman &amp; Newman CLI — Collection v2.1, <code>pm.iterationData</code> y <code>newman-reporter-htmlextra</code>: <em>https://learning.postman.com/docs/</em></li>
    <li>Mocha, Chai, Sinon &amp; c8 Coverage: <em>https://mochajs.org/</em> · <em>https://sinonjs.org/</em></li>
    <li>Deque Systems — <code>@axe-core/playwright</code> y Estándar WCAG 2.1 AA: <em>https://dequeuniversity.com/rules/axe/</em></li>
    <li>Google Chrome Developers — Lighthouse &amp; Core Web Vitals (LCP, CLS, TBT): <em>https://developer.chrome.com/docs/lighthouse/</em></li>
  </ul>

  <h2>13.2. Anexo A: Matriz Completa de Casos de Prueba (CP-01 a CP-47, IA-01 a IA-03, A11Y-01 a A11Y-04)</h2>
  <table class="data">
    <thead>
      <tr><th>ID</th><th>Nivel</th><th>Módulo / Endpoint / Flujo</th><th>Descripción del Escenario</th><th>Resultado Esperado</th><th>Estado</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>CP-01</strong></td><td>Unitaria</td><td><code>ProgresoDiario</code></td><td>Calcular límite máximo para hábito diario (frecuencia = 3)</td><td>Retorna exactamente <code>3</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-02</strong></td><td>Unitaria</td><td><code>ProgresoSemanal</code></td><td>Priorizar <code>frecuenciaSemanal</code> sobre frecuencia diaria</td><td>Retorna <code>5</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-03</strong></td><td>Unitaria</td><td><code>ProgresoMensual</code></td><td>Calcular límite para hábito mensual (frecuencia = 12)</td><td>Retorna <code>12</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-04</strong></td><td>Unitaria</td><td><code>ProgresoBridge</code></td><td>Rechazar periodicidad no soportada (<code>"anual"</code>)</td><td>Lanza excepción controlada</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-05</strong></td><td>Unitaria</td><td><code>ProgresoProxy</code></td><td>Permitir incremento cuando progreso &lt; meta (Stub)</td><td>Delega a servicio e incrementa a 2</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-06</strong></td><td>Unitaria</td><td><code>ProgresoProxy</code></td><td>Bloquear incremento al alcanzar el límite (Stub + Spy)</td><td>Lanza error y no invoca servicio</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-07</strong></td><td>Unitaria</td><td><code>ValidacionesUsuario</code></td><td>Rechazar correo electrónico con formato inválido</td><td>Retorna <code>valido: false</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-08</strong></td><td>Unitaria</td><td><code>ValidacionesUsuario</code></td><td>Rechazar contraseña con 5 caracteres (&lt; límite 6)</td><td>Retorna <code>valido: false</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-09</strong></td><td>Unitaria</td><td><code>ValidacionesUsuario</code></td><td>Aceptar contraseña en límite exacto de 6 caracteres</td><td>Retorna <code>true</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-10</strong></td><td>Unitaria</td><td><code>ValidacionesUsuario</code></td><td>Rechazar edad negativa, menor de 18 o no numérica (+ tel.)</td><td>Retorna <code>false</code> en inválidos</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-11</strong></td><td>Unitaria</td><td><code>bcrypt</code></td><td>Hashear contraseña y validar comparación segura</td><td>Hash &ne; texto plano y <code>compare=true</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-12</strong></td><td>Unitaria</td><td>Modelo <code>Habito</code></td><td>Rechazar hábito sin nombre ni descripción</td><td>Error de validación <code>required</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-13</strong></td><td>Unitaria</td><td><code>HabitoPrototype</code></td><td>Reiniciar contador de progreso a 0 al clonar (Stubs)</td><td>Clon creado con <code>progreso: 0</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-14</strong></td><td>Unitaria</td><td><code>EmailAdapter</code></td><td>Formatear destinatario, asunto y cuerpo (Mock transporter)</td><td>Invoca <code>sendMail</code> correctamente</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-15</strong></td><td>Unitaria</td><td><code>TelegramAdapter</code></td><td>Estructurar mensaje de recordatorio aislado (Stub bot)</td><td>Invoca <code>sendMessage</code> sin red real</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-16</strong></td><td>API Humo</td><td><code>GET /health</code></td><td>Verificar estado operativo del servidor</td><td><code>200 OK</code>, <code>status: "ok"</code>, &lt; 500ms</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-17</strong></td><td>API Contrato</td><td><code>GET /ObtenerCategoria</code></td><td>Consultar catálogo de 6 categorías (JSON Schema #1)</td><td><code>200 OK</code>, contrato válido, guarda <code>categoriaId</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-18</strong></td><td>API</td><td><code>GET /ObtenerSugerencias</code></td><td>Consultar lista de sugerencias precargadas</td><td><code>200 OK</code>, arreglo no vacío</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-19</strong></td><td>API CRUD</td><td><code>POST /RegistroUsuario</code></td><td>Crear cuenta nueva sin exponer clave (JSON Schema #2)</td><td><code>201 Created</code>, encadena <code>usuarioId</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-20</strong></td><td>API Neg.</td><td><code>POST /RegistroUsuario</code></td><td>Rechazar registro sin correo obligatorio y datos inválidos</td><td><code>400 Bad Request</code> con lista de errores</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-21</strong></td><td>API Neg.</td><td><code>POST /RegistroUsuario</code></td><td>Rechazar registro con correo electrónico duplicado</td><td><code>409 Conflict</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-22</strong></td><td>API Auth</td><td><code>POST /IniciarSesion</code></td><td>Login exitoso y captura de token JWT (JSON Schema #3)</td><td><code>200 OK</code>, guarda <code>authToken</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-23</strong></td><td>API Neg.</td><td><code>POST /IniciarSesion</code></td><td>Rechazar inicio de sesión con contraseña incorrecta</td><td><code>401 Unauthorized</code> sin token</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-24</strong></td><td>API CRUD</td><td><code>GET /usuario/:id</code></td><td>Consultar perfil propio con Bearer JWT (JSON Schema #4)</td><td><code>200 OK</code>, contrato válido</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-25</strong></td><td>API Neg.</td><td><code>GET /usuario/:id</code></td><td>Rechazar consulta de perfil sin token de autorización</td><td><code>401 Unauthorized</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-26</strong></td><td>API Neg.</td><td><code>GET /usuario/:id</code></td><td>Impedir acceso autenticado al perfil de otro usuario</td><td><code>403 Forbidden</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-27</strong></td><td>API CRUD</td><td><code>PUT /EditarUsuario/:id</code></td><td>Actualizar nombre y teléfono del perfil propio</td><td><code>200 OK</code>, cambios persistidos</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-28</strong></td><td>API CRUD</td><td><code>POST /CrearHabitos</code></td><td>Crear hábito asociado al usuario (JSON Schema #5)</td><td><code>201 Created</code>, encadena <code>habitoId</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-29</strong></td><td>API CRUD</td><td><code>GET /ObtenerHabitos/:id</code> + <code>GET /habito/:id</code></td><td>Consultar detalle (JSON Schema #6) y listado de hábitos</td><td><code>200 OK</code>, incluye <code>habitoId</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-30</strong></td><td>API</td><td><code>PUT /ActualizarProgreso/:id</code></td><td>Incrementar progreso del hábito dentro del límite</td><td><code>200 OK</code>, progreso incrementa a 1</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-31</strong></td><td>API</td><td><code>POST /clonar/:habitoId</code></td><td>Clonar hábito existente reiniciando progreso a 0</td><td><code>201 Created</code>, nombre con <code>(copia)</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-32</strong></td><td>API CRUD</td><td><code>PUT /editar/:habitoId</code></td><td>Editar nombre y descripción conservando progreso</td><td><code>200 OK</code>, progreso intacto</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-33</strong></td><td>API CRUD</td><td><code>DELETE /eliminar/:habitoId</code></td><td>Eliminar hábito propio y limpiar progreso/notificaciones</td><td><code>200 OK</code>, recurso eliminado</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-34</strong></td><td>API Neg.</td><td><code>GET /habito/:id</code></td><td>Consultar hábito eliminado / ObjectId inexistente</td><td><code>404 Not Found</code> (sin 500)</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-35</strong></td><td>API CRUD</td><td><code>DELETE /usuario/:id</code></td><td>Eliminar cuenta de usuario y datos asociados en cascada</td><td><code>200 OK</code>, limpieza completa</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-36</strong></td><td>API DDT</td><td><code>POST /CrearHabitos</code> (DDT)</td><td>Creación parametrizada (5 filas JSON con <code>pm.iterationData.get()</code>)</td><td>5/5 iteraciones <code>201 Created</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-37</strong></td><td>E2E Neg.</td><td>Flujo 1 — Registro</td><td>Validación visual ante datos inválidos en registro</td><td>Alerta visible, permanece en modal</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-38/39</strong></td><td>E2E</td><td>Flujo 1 — Registro y Login</td><td>Registro completo e inicio de sesión hacia panel principal</td><td>Redirige a <code>/panel-principal</code> con nombre</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-40</strong></td><td>E2E Neg.</td><td>Flujo 1 — Login</td><td>Rechazar inicio de sesión con contraseña incorrecta</td><td>Alerta de error visible, permanece en <code>/</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-41</strong></td><td>E2E Neg.</td><td>Flujo 1 — Seguridad SPA</td><td>Bloquear acceso directo a <code>/panel-principal</code> sin sesión</td><td>Guardia redirige a portada <code>/</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-42</strong></td><td>E2E + DDT</td><td>Flujo 2 — Creación Hábitos</td><td>Crear hábito individual y 3 casos parametrizados DDT</td><td>Tarjetas visibles con categoría y periodo</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-43</strong></td><td>E2E Neg.</td><td>Flujo 2 — Formulario Hábito</td><td>Validar mensajes obligatorios al enviar formulario vacío</td><td>6 mensajes de error visibles</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-44</strong></td><td>E2E</td><td>Flujo 3 — Progreso</td><td>Incrementar progreso 0% → 50% y verificar persistencia F5</td><td>Mantiene <code>50%</code> tras recargar</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-45</strong></td><td>E2E</td><td>Flujo 2 — Edición Hábito</td><td>Editar nombre y descripción de hábito desde su tarjeta</td><td>Tarjeta refleja cambios inmediatamente</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-46</strong></td><td>E2E</td><td>Flujo 2 — Eliminación</td><td>Eliminar hábito y comprobar persistencia tras recarga</td><td>Tarjeta removida (<code>count=0</code> tras F5)</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>CP-47</strong></td><td>E2E</td><td>Flujo 3 — Sugerencias</td><td>Adoptar hábito predefinido desde catálogo de sugerencias</td><td>Aparece en <em>Mis hábitos</em></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>IA-01</strong></td><td>E2E IA</td><td><code>e2e/ia/</code> — Clonación</td><td>Clonar hábito al 100% y validar copia en 0% (Prototype)</td><td>Copia 0% y original 100%</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>IA-02</strong></td><td>E2E IA</td><td><code>e2e/ia/</code> — Perfil</td><td>Actualizar perfil en <code>ModalPerfil</code> y sincronizar header</td><td>Nuevo nombre persiste tras F5</td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>IA-03</strong></td><td>E2E IA</td><td><code>e2e/ia/</code> — Filtro &amp; Logout</td><td>Filtrar sugerencias por categoría <code>Estudio</code> y cerrar sesión</td><td>Filtra correctamente y redirige a <code>/</code></td><td><span class="badge-pass">OK</span></td></tr>
      <tr><td><strong>A11Y-01..04</strong></td><td>A11Y</td><td><code>e2e/accesibilidad.spec.js</code></td><td>Auditoría WCAG 2.1 AA con <code>@axe-core/playwright</code> en 4 vistas</td><td>0 violaciones <code>critical/serious</code></td><td><span class="badge-pass">OK</span></td></tr>
    </tbody>
  </table>

  <h2>13.3. Anexo B: Comandos de Ejecución desde Clon Limpio y Enlaces a Reportes</h2>
  <pre><code>git clone https://github.com/JAlfredoSoc/HabitsUp.git &amp;&amp; cd HabitsUp
npm install &amp;&amp; npm --prefix Back install &amp;&amp; npm --prefix Front install
npx playwright install chromium firefox

npm run test:coverage      # 1. Unitarias (16/16) + Reporte HTML en reports/coverage/index.html
npm run test:api           # 2. API Newman + DDT (530 asserts) + reports/newman/habitsup-api-report.html
npm run test:e2e           # 3. E2E Playwright (Chromium + Firefox) + IA + axe -&gt; reports/playwright/index.html
npm run test:lighthouse    # 4. Lighthouse (3 páginas clave) -&gt; reports/lighthouse/index.html</code></pre>
</body>
</html>`;
}

async function main() {
  const html = buildFullHtml();
  const tempHtmlPath = path.join(ROOT, 'reports', 'Informe_Final_Habits_UP.html');
  const pdfOutputPath = path.join(ROOT, 'Informe_Final_Habits_UP.pdf');

  fs.mkdirSync(path.dirname(tempHtmlPath), { recursive: true });
  fs.writeFileSync(tempHtmlPath, html, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  await page.pdf({
    path: pdfOutputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate:
      '<div style="font-size:7.5pt;color:#64748b;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif;"><span>Universidad Popular del Cesar — Ingeniería de Pruebas Automatizadas</span><span>Proyecto Final: Habits UP</span></div>',
    footerTemplate:
      '<div style="font-size:7.5pt;color:#64748b;width:100%;padding:0 16mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif;"><span>Jose Alfredo Maestre Manjarrez · Ismael Jose Peñaloza Ortiz</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>',
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm',
    },
  });

  await browser.close();
  console.log(`✅ Informe Final PDF generado exitosamente en: ${pdfOutputPath}`);
}

main().catch((err) => {
  console.error('❌ Error generando PDF:', err);
  process.exit(1);
});
