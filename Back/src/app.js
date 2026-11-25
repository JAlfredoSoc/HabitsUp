const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");
const cors = require("cors");
const app = express();

const allowedOrigins = new Set(
  (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://localhost:4173");
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  })
);
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