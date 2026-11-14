const Habito = require("../models/habito.model");
const Categoria = require("../models/categoriaHabito");
const Progreso = require("../models/progresoHabito.model");
const Usuario = require("../models/usuario.model");
const Notificacion = require("../models/notificacion.model");
const HabitoBuilder = require("../services/habito/HabitoBuilder");
const HabitoDirector = require("../services/habito/HabitoDirector");
const HabitoPrototype = require("../services/habito/prototype/HabitoPrototype");
const EmailCreador = require("../services/Notificacion/creadores/EmailNotificacionCreador");
const WhatsAppCreador = require("../services/Notificacion/creadores/WhatsAppNotificacion");
const RecordatorioCreador = require("../services/Notificacion/creadores/RecordatorioNotificacionCreador");

const registrarHistorial = require("../helper/registrarHistorial");

const HistorialHabito = require("../models/historialHabito.model");
const HabitoFactory = require("../services/composite/HabitoFactory");

const CategoriaFactory = require("../services/flyweight/CategoriaFactory");

// Crear Habito
class HabitoContorller {
  async crearHabito(req, res) {
    try {
      const {
        nombre,
        descripcion,
        estado,
        horario,
        fechaInicio,
        fechaFin,
        categoria,
        periodo,
        frecuencia,
        usuarioId,
        notificacionActiva,
        tipoNotificacion,
        diasSeleccionados,
        frecuenciaSemanal,
        subHabitos,
      } = req.body;

      const categoriaFlyweight = CategoriaFactory.getCategoria(categoria);

      // 👇 este es el valor optimizado que debes usar
      const categoriaFinal = categoriaFlyweight.getNombre();

      // APLICANDO PTRON BUILDER
      // 1️⃣ Crear hábito
      const builder = new HabitoBuilder();
      const director = new HabitoDirector();

      const habitoData = director.construirHabitoCompleto(builder, {
        nombre,
        descripcion,
        estado,
        horario,
        fechaInicio,
        fechaFin,
        categoria: categoriaFinal,
        diasSeleccionados,
      });

      const nuevoHabito = new Habito(habitoData);
      const habitoGuardado = await nuevoHabito.save();

      let subHabitosIds = [];

      if (subHabitos && subHabitos.length > 0) {
        for (const sub of subHabitos) {
          const subHabito = new Habito({
            nombre: sub.nombre,
            descripcion: sub.descripcion,
            estado: "pendiente",
            horario,
            fechaInicio,
            fechaFin,
            categoria: categoriaFinal,
            diasSeleccionados: diasSeleccionados,
          });

          const subGuardado = await subHabito.save();

          // 🔥 CREAR PROGRESO PARA SUBHÁBITO
          const progresoSub = new Progreso({
            habito: subGuardado._id,
            periodo,
            frecuencia,
            progreso: 0,
            frecuenciaSemanal:
              periodo === "semanal"
                ? Number(frecuenciaSemanal || frecuencia)
                : Number(frecuenciaSemanal || 0),
          });

          const progresoSubGuardado = await progresoSub.save();

          // 🔥 vincular progreso al subhábito
          subGuardado.progreso = progresoSubGuardado._id;
          await subGuardado.save();

          subHabitosIds.push(subGuardado._id);
        }

        habitoGuardado.subHabitos = subHabitosIds;
        await habitoGuardado.save();
      }

      // Notificacion
      let notificacionGuardada = null;

      if (notificacionActiva) {
        console.log("Tipo:", tipoNotificacion);

        const notification = {
          habito_id: habitoGuardado._id,
          type: tipoNotificacion,
          tituloNotificacion: `Recordatorio: ${habitoGuardado.nombre}`,
          descripcionNotificacion: habitoGuardado.descripcion,
          fechaEnvio: horario,
        };

        notificacionGuardada = await Notificacion.create(notification);

        // vincular al hábito
        habitoGuardado.notificaciones.push(notificacionGuardada._id);
        await habitoGuardado.save();
      }

      // 2️⃣ Crear progreso
      const nuevoProgreso = new Progreso({
        habito: habitoGuardado._id,
        periodo,
        frecuencia,
        progreso: 0,
        frecuenciaSemanal:
          periodo === "semanal"
            ? Number(frecuenciaSemanal || frecuencia)
            : Number(frecuenciaSemanal || 0),
      });

      const progresoGuardado = await nuevoProgreso.save();

      // 3️⃣ 🔥 Vincular progreso al hábito
      habitoGuardado.progreso = progresoGuardado._id;
      await habitoGuardado.save();

      // 4️⃣ 🔥 Asociar hábito al usuario
      await Usuario.findByIdAndUpdate(usuarioId, {
        $addToSet: { habitos: habitoGuardado._id },
      });

      await registrarHistorial({
        habitoId: habitoGuardado._id,
        usuarioId,
        accion: "CREADO",
        detalle: "Hábito creado",
      });

      // 5️⃣ Respuesta
      res.status(201).json({
        habito: habitoGuardado,
        progreso: progresoGuardado,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // habito.controller.js - Agregar este método
  async obtenerHabitosPorUsuario(req, res) {
    try {
      const { usuarioID } = req.params;

      // Buscar usuario y popular sus hábitos con notificaciones y progreso
      const usuario = await Usuario.findById(usuarioID).populate({
        path: "habitos",
        populate: [
          {
            path: "notificaciones", // 👈 Popula las notificaciones
            model: "Notificacion",
          },
          {
            path: "progreso", // 👈 Popula el progreso
            model: "Progreso",
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Transformar los hábitos para incluir los datos del progreso
      const habitosConProgreso = usuario.habitos.map((habito) => {
        const habitoObj = habito.toObject();
        const categoriaFlyweight = CategoriaFactory.getCategoria(
          habitoObj.categoria,
        );
        return {
          ...habitoObj,
          categoria: categoriaFlyweight.getNombre(),
          progreso: habitoObj.progreso?.progreso || 0,
          periodo: habitoObj.progreso?.periodo || "",
          frecuencia: habitoObj.progreso?.frecuencia || "",
        };
      });

      res.json({
        success: true,
        data: habitosConProgreso,
      });
    } catch (error) {
      console.error("Error al obtener hábitos:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async seleccionarHabito(req, res) {
    try {
      const { usuarioId, habitoId } = req.body;
      // Validar que el hábito exista
      const habito = await Habito.findById(habitoId);
      if (!habito) {
        return res.status(404).json({ message: "Hábito no encontrado" });
      }

      // Agregar hábito al usuario (sin duplicar)
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        usuarioId,
        {
          $addToSet: { habitos: habitoId }, // 👈 evita duplicados 🔥
        },
        { new: true },
      ).populate("habitos");

      res.json({
        message: "Hábito agregado al usuario",
        data: usuarioActualizado,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //CLONAR HABITO
  async clonarHabito(req, res) {
    try {
      const { habitoId } = req.params;
      const { usuarioId } = req.body;

      const habitoClonado = await HabitoPrototype.clonarHabito(
        habitoId,
        usuarioId,
      );

      res.json({
        success: true,
        data: habitoClonado,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async editarHabito(req, res) {
    try {
      const { habitoId } = req.params;
      const datosActualizados = req.body;
      const {
        nombre,
        descripcion,
        estado,
        horario,
        fechaInicio,
        fechaFin,
        categoria,
        diasSeleccionados,
        periodo,
        frecuencia,
        frecuenciaSemanal,
        usuarioId,
      } = datosActualizados;

      const habito = await Habito.findByIdAndUpdate(
        habitoId,
        {
          nombre,
          descripcion,
          estado,
          horario,
          fechaInicio,
          fechaFin,
          categoria,
          diasSeleccionados,
        },
        { new: true, runValidators: true },
      )
        .populate("categoria")
        .populate("progreso");

      if (!habito) {
        return res.status(404).json({
          message: "Hábito no encontrado",
        });
      }

      if (periodo || frecuencia !== undefined || frecuenciaSemanal !== undefined) {
        await Progreso.findOneAndUpdate(
          { habito: habitoId },
          {
            ...(periodo && { periodo }),
            ...(frecuencia !== undefined && { frecuencia }),
            ...(frecuenciaSemanal !== undefined && { frecuenciaSemanal }),
            ...(periodo === "semanal" &&
              frecuenciaSemanal === undefined && {
                frecuenciaSemanal: frecuencia,
              }),
          },
          { runValidators: true },
        );
        await habito.populate("progreso");
      }

      const usuario = usuarioId
        ? await Usuario.findById(usuarioId)
        : await Usuario.findOne({ habitos: habitoId });
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      await registrarHistorial({
        habitoId: habitoId,
        usuarioId: usuario?._id,
        accion: "EDITADO",
        detalle: "Hábito actualizado",
      });

      res.json({
        message: "Hábito actualizado correctamente",
        data: habito,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async obtenerCategorias(req, res) {
    try {
      const categorias = await Categoria.find();
      res.json({ success: true, data: categorias });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async completarHabito(req, res) {
    const { habitoId, usuarioId } = req.body;

    const habito = await Habito.findById(habitoId).populate("subHabitos");

    if (!habito) {
      return res.status(404).json({ message: "Hábito no encontrado" });
    }

    // 🔥 AQUÍ ocurre el patrón Composite
    const componente = HabitoFactory.crear(habito);
    await componente.completar();

    await registrarHistorial({
      habitoId,
      usuarioId,
      accion: "COMPLETADO",
      detalle: "Hábito completado con Composite",
    });

    res.json({
      message: "Hábito completado correctamente usando Composite",
    });
  }

  async historialHabito(req, res) {
    try {
      const { habitoId } = req.params;

      const historial = await HistorialHabito.find({ habito: habitoId })
        .populate("usuario", "nombre")
        .sort({ fecha: -1 });

      res.json({
        success: true,
        data: historial,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async eliminarHabito(req, res) {
    try {
      const { habitoId } = req.params;
      const { usuarioId } = req.body;

      // 1️⃣ Buscar hábito
      const habito = await Habito.findById(habitoId)
        .populate("progreso")
        .populate("notificaciones");

      if (!habito) {
        return res.status(404).json({
          message: "Hábito no encontrado",
        });
      }

      // 2️⃣ Eliminar progreso
      if (habito.progreso) {
        await Progreso.findByIdAndDelete(habito.progreso._id);
      }

      // 3️⃣ Eliminar notificaciones
      if (habito.notificaciones && habito.notificaciones.length > 0) {
        await Notificacion.deleteMany({
          _id: { $in: habito.notificaciones },
        });
      }

      // 4️⃣ Quitar hábito del usuario
      if (usuarioId) {
        await Usuario.findByIdAndUpdate(usuarioId, {
          $pull: { habitos: habitoId },
        });
      }

      // 5️⃣ Eliminar hábito
      await Habito.findByIdAndDelete(habitoId);

      // 6️⃣ Registrar historial
      await registrarHistorial({
        habitoId,
        usuarioId,
        accion: "ELIMINADO",
        detalle: "Hábito eliminado",
      });

      res.json({
        success: true,
        message: "Hábito eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new HabitoContorller();
