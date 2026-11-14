const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Habit Tracker API",
    description: "API para gestionar hábitos diarios",
    version: "1.0.0",
    contact: {
      name: "Tu Nombre",
      email: "tuemail@example.com",
    },
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Ingresa el token JWT con el formato: Bearer {token}",
    },
  },
  definitions: {
    Habito: {
      nombre: "Meditar",
      descripcion: "Meditar 10 minutos",
      horario: "08:00",
      estado: "activo",
    },
    Usuario: {
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      edad: 25,
    },
  },
};

const outputFile = "./swagger-output.json"; // Archivo que se generará
const endpointsFiles = [
  "./src/routes/habito.routes.js",
  "./src/routes/usuario.routes.js",
]; // Archivo donde están tus rutas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("✅ Documentación Swagger generada correctamente");
});
