const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { chromium } = require('@playwright/test');

const app = require('../Back/src/app');
const connectDB = require('../Back/src/config/db');
const { disconnectDB } = require('../Back/src/config/db');

const BACK_PORT = 3000;
const FRONT_PORT = 5173;
const REPORT_DIR = path.resolve(__dirname, '../reports/lighthouse');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForUrl(url, maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (await checkUrl(url)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  let backServer = null;
  let startedBack = false;
  let frontProc = null;
  let startedFront = false;
  let browser = null;

  try {
    // 1. Asegurar Backend activo
    if (!(await checkUrl(`http://localhost:${BACK_PORT}/health`))) {
      process.env.NODE_ENV = 'test';
      await connectDB();
      backServer = await new Promise((resolve) => {
        const srv = app.listen(BACK_PORT, () => resolve(srv));
      });
      startedBack = true;
      console.log(`🚀 Backend iniciado en http://localhost:${BACK_PORT}`);
    }

    // 2. Asegurar Frontend activo
    if (!(await checkUrl(`http://localhost:${FRONT_PORT}`))) {
      frontProc = spawn(
        process.execPath,
        ['./node_modules/vite/bin/vite.js', '--port', String(FRONT_PORT)],
        {
          cwd: path.resolve(__dirname, '../Front'),
          stdio: 'ignore',
        }
      );
      startedFront = true;
      await waitForUrl(`http://localhost:${FRONT_PORT}`);
      console.log(`🚀 Frontend iniciado en http://localhost:${FRONT_PORT}`);
    }

    // 3. Crear usuario de prueba vía API para auditar vistas autenticadas
    const correoAudit = `lighthouse.${Date.now()}@example.test`;
    const regRes = await fetch(`http://localhost:${BACK_PORT}/RegistroUsuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Auditor Lighthouse',
        correo: correoAudit,
        contrasena: 'Password123!',
        edad: '25',
        telefono: '3001234567',
      }),
    });
    const regData = await regRes.json();
    const usuarioObj = regData.usuario;

    // Crear un hábito para que el panel tenga contenido real durante la medición
    await fetch(`http://localhost:${BACK_PORT}/CrearHabitos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Hábito Auditoría Lighthouse',
        descripcion: 'Hábito activo para evaluación de métricas LCP, CLS y TBT',
        categoria: 'Salud',
        periodo: 'diario',
        frecuencia: 2,
        usuarioId: usuarioObj._id,
      }),
    });

    // 4. Lanzar Chromium con puerto de depuración remota para Lighthouse
    const debugPort = 9222;
    browser = await chromium.launch({
      headless: true,
      args: [
        `--remote-debugging-port=${debugPort}`,
        '--no-sandbox',
        '--disable-gpu',
      ],
    });

    const lighthouseModule = await import('lighthouse');
    const lighthouse = lighthouseModule.default;

    const paginasAEvaluar = [
      {
        id: 'pagina-inicio',
        nombre: '1. Página Principal / Landing (/)',
        url: `http://localhost:${FRONT_PORT}/`,
        requiereAuth: false,
      },
      {
        id: 'panel-principal-habitos',
        nombre: '2. Panel Principal - Mis Hábitos (/panel-principal)',
        url: `http://localhost:${FRONT_PORT}/panel-principal`,
        requiereAuth: true,
      },
      {
        id: 'panel-sugerencias',
        nombre: '3. Catálogo y Gestión de Hábitos (/panel-principal?vista=sugerencias)',
        url: `http://localhost:${FRONT_PORT}/panel-principal?vista=sugerencias`,
        requiereAuth: true,
      },
    ];

    // Pre-cargar localStorage en el perfil del navegador de auditoría
    const pageSetup = await browser.newPage();
    await pageSetup.goto(`http://localhost:${FRONT_PORT}/`);
    await pageSetup.evaluate((u) => {
      localStorage.setItem('usuario', JSON.stringify(u));
    }, usuarioObj);
    await pageSetup.close();

    const resumenMetricas = [];

    for (const pagina of paginasAEvaluar) {
      console.log(`📊 Ejecutando Lighthouse sobre: ${pagina.nombre}...`);

      const runnerResult = await lighthouse(pagina.url, {
        port: debugPort,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        disableStorageReset: true,
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1280,
          height: 720,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttlingMethod: 'provided',
      });

      const htmlReport = runnerResult.report[0];
      const jsonReport = JSON.parse(runnerResult.report[1]);

      const htmlFilePath = path.join(REPORT_DIR, `lighthouse-${pagina.id}.html`);
      const jsonFilePath = path.join(REPORT_DIR, `lighthouse-${pagina.id}.json`);
      fs.writeFileSync(htmlFilePath, htmlReport, 'utf8');
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonReport, null, 2), 'utf8');

      const perfScore = Math.round(
        (jsonReport.categories.performance?.score || 0) * 100
      );
      const a11yScore = Math.round(
        (jsonReport.categories.accessibility?.score || 0) * 100
      );
      const bpScore = Math.round(
        (jsonReport.categories['best-practices']?.score || 0) * 100
      );
      const seoScore = Math.round((jsonReport.categories.seo?.score || 0) * 100);

      const lcp =
        jsonReport.audits['largest-contentful-paint']?.displayValue || 'N/A';
      const lcpMs = Math.round(
        jsonReport.audits['largest-contentful-paint']?.numericValue || 0
      );
      const cls =
        jsonReport.audits['cumulative-layout-shift']?.displayValue || '0';
      const tbt =
        jsonReport.audits['total-blocking-time']?.displayValue || '0 ms';
      const tbtMs = Math.round(
        jsonReport.audits['total-blocking-time']?.numericValue || 0
      );
      const fcp =
        jsonReport.audits['first-contentful-paint']?.displayValue || 'N/A';

      resumenMetricas.push({
        id: pagina.id,
        nombre: pagina.nombre,
        url: pagina.url,
        performanceScore: perfScore,
        accessibilityScore: a11yScore,
        bestPracticesScore: bpScore,
        seoScore: seoScore,
        LCP: lcp,
        LCP_ms: lcpMs,
        CLS: cls,
        TBT: tbt,
        TBT_ms: tbtMs,
        FCP: fcp,
        reportFile: `lighthouse-${pagina.id}.html`,
      });
    }

    fs.writeFileSync(
      path.join(REPORT_DIR, 'lighthouse-summary.json'),
      JSON.stringify(resumenMetricas, null, 2),
      'utf8'
    );

    const filas = resumenMetricas
      .map(
        (m) => `
      <tr>
        <td><strong>${m.nombre}</strong></td>
        <td style="font-weight:bold;color:${m.performanceScore >= 70 ? '#16a34a' : '#d97706'};">${m.performanceScore} / 100</td>
        <td style="font-weight:bold;color:${m.accessibilityScore >= 90 ? '#16a34a' : '#d97706'};">${m.accessibilityScore} / 100</td>
        <td>${m.LCP}</td>
        <td>${m.CLS}</td>
        <td>${m.TBT}</td>
        <td><a href="./${m.reportFile}">Ver reporte HTML</a></td>
      </tr>`
      )
      .join('');

    const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Resumen de Auditoría Lighthouse (Rendimiento y Accesibilidad) - Habits UP</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; background: #f8fafc; color: #0f172a; }
    h1 { color: #5b21b6; }
    table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #6d28d9; color: #fff; }
  </style>
</head>
<body>
  <h1>Reporte Consolidado de Rendimiento y Accesibilidad (Google Lighthouse)</h1>
  <p><strong>Proyecto:</strong> Habits UP | <strong>Meta sugerida:</strong> Puntaje de Rendimiento &ge; 70.</p>
  <table>
    <thead>
      <tr>
        <th>Página Clave Evaluada</th>
        <th>Puntaje Rendimiento</th>
        <th>Puntaje Accesibilidad</th>
        <th>LCP (Largest Contentful Paint)</th>
        <th>CLS (Cumulative Layout Shift)</th>
        <th>TBT (Total Blocking Time)</th>
        <th>Reporte Detallado</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
    </tbody>
  </table>
</body>
</html>`;

    fs.writeFileSync(path.join(REPORT_DIR, 'index.html'), indexHtml, 'utf8');

    console.log('\n✅ Auditoría Lighthouse completada exitosamente:');
    console.table(
      resumenMetricas.map((m) => ({
        Pagina: m.nombre,
        Rendimiento: m.performanceScore,
        Accesibilidad: m.accessibilityScore,
        LCP: m.LCP,
        CLS: m.CLS,
        TBT: m.TBT,
      }))
    );
  } catch (error) {
    console.error('❌ Error en auditoría Lighthouse:', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (startedFront && frontProc) frontProc.kill();
    if (startedBack && backServer) {
      await new Promise((r) => backServer.close(r));
      await disconnectDB();
    }
  }
}

main();
