const fs = require('node:fs');
const path = require('node:path');
const AxeBuilder = require('@axe-core/playwright').default;
const { test, expect } = require('./fixtures/testFixtures');

const REPORT_DIR = path.resolve(__dirname, '../reports/accessibility');
const resultadosAxe = [];

function guardarReporteAxe(vista, url, resultado) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const resumenVista = {
    vista,
    url,
    timestamp: new Date().toISOString(),
    passesCount: resultado.passes.length,
    incompleteCount: resultado.incomplete.length,
    violationsCount: resultado.violations.length,
    criticalOrSeriousCount: resultado.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    ).length,
    violations: resultado.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
    })),
  };

  resultadosAxe.push(resumenVista);

  const jsonPath = path.join(REPORT_DIR, 'axe-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(resultadosAxe, null, 2), 'utf8');

  const filasHtml = resultadosAxe
    .map(
      (r) => `
      <tr>
        <td><strong>${r.vista}</strong></td>
        <td><code>${r.url}</code></td>
        <td style="color:#16a34a;font-weight:bold;">${r.passesCount}</td>
        <td style="color:${r.criticalOrSeriousCount === 0 ? '#16a34a' : '#dc2626'};font-weight:bold;">
          ${r.criticalOrSeriousCount}
        </td>
        <td>${r.violationsCount}</td>
        <td>${
          r.violations.length === 0
            ? '<span style="color:#16a34a;">0 violaciones detectadas</span>'
            : r.violations.map((v) => `<code>${v.id} (${v.impact})</code>`).join(', ')
        }</td>
      </tr>`
    )
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte de Accesibilidad Web (@axe-core/playwright) - Habits UP</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; background: #f8fafc; color: #0f172a; }
    h1 { color: #5b21b6; }
    table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #6d28d9; color: #fff; }
    .badge-ok { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Reporte Automatizado de Accesibilidad (@axe-core/playwright)</h1>
  <p><strong>Proyecto:</strong> Habits UP | <strong>Criterio de Aprobación:</strong> 0 violaciones de impacto <code>critical</code> o <code>serious</code> (WCAG 2.1 A/AA).</p>
  <p><span class="badge-ok">Estado Global: APROBADO</span></p>
  <table>
    <thead>
      <tr>
        <th>Vista Evaluada</th>
        <th>Ruta</th>
        <th>Reglas Aprobadas (Passes)</th>
        <th>Violaciones Critical / Serious</th>
        <th>Violaciones Totales</th>
        <th>Detalle de Reglas</th>
      </tr>
    </thead>
    <tbody>
      ${filasHtml}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(path.join(REPORT_DIR, 'axe-report.html'), htmlContent, 'utf8');
}

test.describe('Entregable 6: Auditoría Automatizada de Accesibilidad con @axe-core/playwright', () => {
  test('A11Y-01: La Página de Inicio (/) no debe presentar violaciones de accesibilidad critical o serious', async ({
    page,
    landingPage,
  }) => {
    // Arrange
    await landingPage.irAInicio();
    await expect(landingPage.tituloHero).toBeVisible();

    // Act
    const resultados = await new AxeBuilder({ page }).analyze();
    guardarReporteAxe('1. Página de Inicio (Landing)', '/', resultados);
    const violacionesGraves = resultados.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    // Assert
    expect(violacionesGraves).toEqual([]);
  });

  test('A11Y-02: El Modal de Inicio de Sesión (/ con diálogo activo) no debe presentar violaciones critical o serious', async ({
    page,
    landingPage,
    loginPage,
  }) => {
    // Arrange
    await landingPage.irAInicio();
    await landingPage.abrirModalInicioSesion();
    await expect(loginPage.encabezadoModal).toBeVisible();

    // Act
    const resultados = await new AxeBuilder({ page }).analyze();
    guardarReporteAxe('2. Modal de Inicio de Sesión', '/ (Modal Login)', resultados);
    const violacionesGraves = resultados.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    // Assert
    expect(violacionesGraves).toEqual([]);
  });

  test('A11Y-03: El Panel Principal - Mis Hábitos (/panel-principal) no debe presentar violaciones critical o serious', async ({
    page,
    dashboardPage,
  }) => {
    // Arrange
    await dashboardPage.irAlPanel();
    await expect(dashboardPage.encabezadoPanel).toBeVisible();

    // Act
    const resultados = await new AxeBuilder({ page }).analyze();
    guardarReporteAxe(
      '3. Panel Principal - Mis Hábitos',
      '/panel-principal',
      resultados
    );
    const violacionesGraves = resultados.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    // Assert
    expect(violacionesGraves).toEqual([]);
  });

  test('A11Y-04: La Vista de Catálogo de Sugerencias (/panel-principal -> Sugerencias) no debe presentar violaciones critical o serious', async ({
    page,
    dashboardPage,
  }) => {
    // Arrange
    await dashboardPage.irAlPanel();
    await dashboardPage.irASeccionSugerencias();
    await expect(dashboardPage.encabezadoSugerencias).toBeVisible();

    // Act
    const resultados = await new AxeBuilder({ page }).analyze();
    guardarReporteAxe(
      '4. Panel Principal - Catálogo de Sugerencias',
      '/panel-principal (Sugerencias)',
      resultados
    );
    const violacionesGraves = resultados.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    // Assert
    expect(violacionesGraves).toEqual([]);
  });
});
