const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const newman = require("newman");

const app = require("../src/app");
const connectDB = require("../src/config/db");
const { disconnectDB } = require("../src/config/db");

const PORT = process.env.PORT || 3000;

function checkServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function runNewman(options) {
  return new Promise((resolve, reject) => {
    newman.run(options, (err, summary) => {
      if (err) return reject(err);
      resolve(summary);
    });
  });
}

async function main() {
  let server = null;
  let startedLocalServer = false;

  try {
    const alreadyRunning = await checkServerRunning(PORT);

    if (!alreadyRunning) {
      process.env.NODE_ENV = "test";
      await connectDB();
      server = await new Promise((resolve) => {
        const srv = app.listen(PORT, () => {
          console.log(`🚀 Servidor API de pruebas levantado en http://localhost:${PORT}`);
          resolve(srv);
        });
      });
      startedLocalServer = true;
    } else {
      console.log(`ℹ️ Usando servidor API activo en http://localhost:${PORT}`);
    }

    const collectionPath = path.resolve(
      __dirname,
      "../postman/HabitsUp.postman_collection.json"
    );
    const environmentPath = path.resolve(
      __dirname,
      "../postman/HabitsUp.postman_environment.json"
    );
    const iterationDataPath = path.resolve(
      __dirname,
      "../postman/ddt_habitos.json"
    );

    // Generar reporte tanto en la carpeta raíz reports/newman/ (requerida por la lista de chequeo)
    // como en Back/reports/newman/ para fácil acceso
    const rootReportDir = path.resolve(__dirname, "../../reports/newman");
    const backReportDir = path.resolve(__dirname, "../reports/newman");
    fs.mkdirSync(rootReportDir, { recursive: true });
    fs.mkdirSync(backReportDir, { recursive: true });

    const rootReportFile = path.join(rootReportDir, "habitsup-api-report.html");
    const backReportFile = path.join(backReportDir, "habitsup-api-report.html");

    console.log("🧪 Ejecutando suite de API REST con Newman + Data Driven Testing (5 iteraciones)...");

    const summary = await runNewman({
      collection: require(collectionPath),
      environment: require(environmentPath),
      iterationData: iterationDataPath,
      reporters: ["cli", "htmlextra"],
      reporter: {
        htmlextra: {
          export: rootReportFile,
          title: "HabitsUp API - Reporte de Pruebas Automatizadas (Newman)",
          browserTitle: "HabitsUp API Test Report",
          logs: true,
          showEnvironmentData: true,
          showGlobalData: false,
        },
      },
    });

    // Copiar el reporte también a Back/reports/newman/
    if (fs.existsSync(rootReportFile)) {
      fs.copyFileSync(rootReportFile, backReportFile);
    }

    console.log(`\n📄 Reporte HTML generado exitosamente en:`);
    console.log(`   - ${rootReportFile}`);
    console.log(`   - ${backReportFile}`);

    if (summary.run.failures && summary.run.failures.length > 0) {
      console.error(
        `❌ La ejecución de Newman terminó con ${summary.run.failures.length} fallo(s).`
      );
      process.exitCode = 1;
    } else {
      console.log("✅ Todas las pruebas de API y contratos finalizaron con éxito (0 fallos).");
    }
  } catch (error) {
    console.error("❌ Error ejecutando pruebas de API:", error);
    process.exitCode = 1;
  } finally {
    if (startedLocalServer && server) {
      await new Promise((resolve) => server.close(resolve));
      await disconnectDB();
      console.log("🛑 Servidor de pruebas y conexión a base de datos cerrados.");
    }
  }
}

main();
