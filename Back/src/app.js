const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const habitoRoutes = require("../src/routes/habito.routes");
const UsuarioRoutes = require("../src/routes/usuario.routes")

app.use(habitoRoutes);
app.use(UsuarioRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Funcionado" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de error global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Error interno del servidor" });
});


module.exports = app;