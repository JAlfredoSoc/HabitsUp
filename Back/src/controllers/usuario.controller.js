const Usuario = require("../models/usuario.model");
const Habito = require("../models/habito.model");
const Progreso = require("../models/progresoHabito.model");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

class UsuarioController {
  // Registrar usuario
  async registrarUsuario(req, res) {
    try {
      const { nombre, correo, contrasena, edad, telefono } = req.body;
      // Verificar si ya existe el usuario
      const existe = await Usuario.findOne({ correo });
      if (existe) {
        return res.status(400).json({
          message: "El correo ya está registrado",
        });
      }

      // Encriptar contraseña
      const saltRounds = 10;
      const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

      // Crear usuario con contraseña encriptada
      const nuevoUsuario = new Usuario({
        nombre,
        correo,
        contrasena: contrasenaHash, // Guardar hash, no la contraseña original
        edad: edad,
        telefono,
      });

      const usuarioGuardado = await nuevoUsuario.save();

      // No devolver la contraseña en la respuesta
      const usuarioResponse = usuarioGuardado.toObject();
      delete usuarioResponse.contrasena;

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        usuario: usuarioResponse,
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({
        message: "Error interno del servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  //Iniciar sesión
  async iniciarSesion(req, res) {
    try {
      const { correo, contrasena } = req.body;

      if (!correo || !contrasena) {
        return res.status(400).json({
          message: "Correo y contraseña son obligatorios",
        });
      }

      const usuario = await Usuario.findOne({ correo });

      if (!usuario) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      // Comparar contraseña con el hash
      const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena,
      );

      if (!contrasenaValida) {
        return res.status(401).json({
          message: "Contraseña incorrecta",
        });
      }

      // No enviar la contraseña en la respuesta
      const { contrasena: _, ...usuarioSinPassword } = usuario.toObject();

      res.json({
        message: "Login exitoso",
        usuario: usuarioSinPassword,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
  // Editar usuario
  async editarUsuario(req, res) {
    try {
      const { usuarioID } = req.params;
      const datos = req.body;
      if (datos.contrasena) {
        datos.contrasena = await bcrypt.hash(datos.contrasena, 10);
      } else {
        delete datos.contrasena;
      }

      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        usuarioID,
        datos,
        { new: true, runValidators: true, select: "-contrasena" },
      );

      if (!usuarioActualizado) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(usuarioActualizado);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Editar usuario por id
  async obtenerUsuarioPorId(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // No devolver la contraseña
      const { contrasena, ...usuarioSinPassword } = usuario.toObject();

      res.json(usuarioSinPassword);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async consultarHabitosUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      const usuario = await Usuario.findById(usuarioId).populate({
        path: "habitos",
        populate: [
          { path: "categoria", model: "Categoria" },
          { path: "progreso" },
          { 
            path: "subHabitos",   // 👈 AQUÍ
            model: "Habito",
            populate: {
              path: "progreso",
            }
          }
        ],
      });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({
        message: "Hábitos del usuario",
        data: usuario.habitos,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async totalHabitosActivosUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      const usuario = await Usuario.findById(usuarioId).populate({
        path: "habitos",
        match: { estado: { $ne: "completado" } },
        populate: [{ path: "categoria" }, { path: "progreso" }],
      });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const habitosActivos = usuario.habitos.filter((h) => h !== null);

      res.json({
        total: habitosActivos.length,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async estadisticasUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const usuario = await Usuario.findById(usuarioId).populate({
        path: "habitos",
        populate: [
          { path: "categoria", select: "nombreCategoria" },
          { path: "progreso" }
        ]
      });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const habitos = usuario.habitos;

      // 🔥 FUNCIÓN CLAVE: determinar si está completado
      const esHabitoCompletado = (h) => {
        if (!h.progreso) return false;

        const { periodo, frecuencia, progreso, frecuenciaSemanal } = h.progreso;

        if (periodo === "diario") {
          return progreso >= frecuencia;
        }

        if (periodo === "semanal") {
          return progreso >= (frecuenciaSemanal || frecuencia);
        }

        if (periodo === "mensual") {
          return progreso >= frecuencia;
        }

        return false;
      };

      // 🔢 Totales
      const totalHabitos = habitos.length;

      const completados = habitos.filter(esHabitoCompletado).length;
      const pendientes = totalHabitos - completados;

      const porcentajeCumplimiento = totalHabitos > 0
        ? ((completados / totalHabitos) * 100).toFixed(2)
        : 0;

      // 🧠 Categorías
      const conteoCategorias = {};
      habitos.forEach(h => {
        const nombre = h.categoria?.nombreCategoria || "Sin categoría";
        conteoCategorias[nombre] = (conteoCategorias[nombre] || 0) + 1;
      });

      let categoriaMasUsada = null;
      let max = 0;

      for (const cat in conteoCategorias) {
        if (conteoCategorias[cat] > max) {
          max = conteoCategorias[cat];
          categoriaMasUsada = cat;
        }
      }

      // 📈 Progreso promedio (más realista)
      let sumaProgreso = 0;
      let totalConProgreso = 0;

      habitos.forEach(h => {
        if (h.progreso) {
          const { periodo, frecuencia, progreso, frecuenciaSemanal } = h.progreso;

          let porcentaje = 0;

          if (periodo === "diario" && frecuencia > 0) {
            porcentaje = (progreso / frecuencia) * 100;
          }

          if (periodo === "semanal" && frecuenciaSemanal > 0) {
            porcentaje = (progreso / frecuenciaSemanal) * 100;
          }

          if (periodo === "semanal" && !frecuenciaSemanal && frecuencia > 0) {
            porcentaje = (progreso / frecuencia) * 100;
          }

          if (periodo === "mensual" && frecuencia > 0) {
            porcentaje = (progreso / frecuencia) * 100;
          }

          sumaProgreso += Math.min(porcentaje, 100); // 🔥 no pasar de 100%
          totalConProgreso++;
        }
      });

      const progresoPromedio = totalConProgreso > 0
        ? (sumaProgreso / totalConProgreso).toFixed(2)
        : 0;

      // 📅 Hábitos por mes
      const habitosPorMes = {};

      habitos.forEach(h => {
        const fecha = new Date(h.fechaInicio);
        const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
        habitosPorMes[key] = (habitosPorMes[key] || 0) + 1;
      });

      // 🔁 Frecuencia semanal promedio
      const frecuenciaPromedio = habitos.length > 0
        ? (
          habitos.reduce((acc, h) => {
            if (!h.progreso) return acc;
            return acc + (h.progreso.frecuenciaSemanal || 0);
          }, 0) / habitos.length
        ).toFixed(2)
        : 0;

      // 📦 Respuesta final
      res.json({
        success: true,
        data: {
          resumen: {
            totalHabitos,
            completados,
            pendientes,
            porcentajeCumplimiento
          },
          categorias: {
            categoriaMasUsada,
            conteoCategorias
          },
          progreso: {
            progresoPromedio,
            frecuenciaPromedio
          },
          actividad: {
            habitosPorMes
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
}

module.exports = new UsuarioController();
