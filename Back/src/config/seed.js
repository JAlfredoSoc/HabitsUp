const Categoria = require("../models/categoriaHabito");
const SugerenciaHabito = require("../models/sugerenciaHabito.model");

const CATEGORIAS_SEMILLA = [
  "Salud",
  "Bienestar",
  "Estudio",
  "Productividad",
  "Trabajo",
  "Relaciones",
];

async function seedInitialData() {
  try {
    const totalCategorias = await Categoria.countDocuments();
    let mapaCategorias = {};

    if (totalCategorias === 0) {
      const insertadas = await Categoria.insertMany(
        CATEGORIAS_SEMILLA.map((nombreCategoria) => ({ nombreCategoria }))
      );
      insertadas.forEach((cat) => {
        mapaCategorias[cat.nombreCategoria] = cat._id;
      });
    } else {
      const existentes = await Categoria.find();
      existentes.forEach((cat) => {
        mapaCategorias[cat.nombreCategoria] = cat._id;
      });
    }

    const totalSugerencias = await SugerenciaHabito.countDocuments();
    if (totalSugerencias === 0) {
      const sugerenciasSemilla = [
        {
          nombre: "Beber 2L de agua",
          descripcion: "Mantener hidratación constante durante todo el día",
          categoria: mapaCategorias["Salud"] || Object.values(mapaCategorias)[0],
        },
        {
          nombre: "Lectura diaria",
          descripcion: "Leer al menos 20 páginas de un libro formativo",
          categoria: mapaCategorias["Estudio"] || Object.values(mapaCategorias)[0],
        },
        {
          nombre: "Meditación",
          descripcion: "Realizar 10 minutos de respiración consciente y mindfulness",
          categoria: mapaCategorias["Bienestar"] || Object.values(mapaCategorias)[0],
        },
      ];
      await SugerenciaHabito.insertMany(sugerenciasSemilla);
    }
  } catch (error) {
    console.error("⚠️ Error sembrando datos iniciales:", error.message);
  }
}

module.exports = seedInitialData;
