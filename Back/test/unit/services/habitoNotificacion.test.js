const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const Habito = require("../../../src/models/habito.model");
const Progreso = require("../../../src/models/progresoHabito.model");
const Usuario = require("../../../src/models/usuario.model");
const habitoPrototype = require("../../../src/services/habito/prototype/HabitoPrototype");
const EmailAdapter = require("../../../src/adapters/EmailAdapter");
const TelegramAdapter = require("../../../src/adapters/TelegramAdapter");

describe("Módulo de Lógica de Hábitos, Clonación y Adaptadores (CP-12 a CP-15)", () => {
  afterEach(() => {
    sinon.restore();
  });

  // CP-12: Validación de campos requeridos al crear hábito
  it("CP-12: Debe rechazar la creación de un hábito si se omiten campos requeridos como el nombre", () => {
    // Arrange: Crear instancia de Hábito sin datos
    const habitoInvalido = new Habito({});

    // Act: Validar sincrónicamente contra el esquema Mongoose
    const validacion = habitoInvalido.validateSync();

    // Assert
    expect(validacion).to.exist;
    expect(validacion.errors).to.have.property("nombre");
    expect(validacion.errors).to.have.property("descripcion");
    expect(validacion.errors.nombre.kind).to.equal("required");
  });

  // CP-13: Lógica de clonación (reinicio de progreso a 0)
  it("CP-13: Debe reiniciar el contador de progreso a cero y marcar estado pendiente al clonar un hábito", async () => {
    // Arrange
    const habitoOriginalMock = {
      _id: new mongoose.Types.ObjectId(),
      nombre: "Lectura Nocturna",
      descripcion: "Leer 20 páginas antes de dormir",
      horario: new Date(),
      fechaFin: new Date(),
      categoria: new mongoose.Types.ObjectId(),
      diasSeleccionados: ["lunes", "miércoles"],
      progreso: {
        _id: new mongoose.Types.ObjectId(),
        periodo: "diario",
        frecuencia: 5,
        progreso: 4, // Progreso acumulado en el hábito original
        frecuenciaSemanal: 0,
      },
      notificaciones: [],
    };

    const populateMock = {
      populate: sinon.stub().returnsThis(),
    };
    populateMock.populate.onSecondCall().resolves(habitoOriginalMock);
    sinon.stub(Habito, "findById").returns(populateMock);

    const habitoGuardadoFake = {
      _id: new mongoose.Types.ObjectId(),
      nombre: "Lectura Nocturna (copia)",
      progreso: null,
      notificaciones: [],
      save: sinon.stub().resolves(),
    };
    sinon.stub(Habito.prototype, "save").resolves(habitoGuardadoFake);

    let datosProgresoCreado = null;
    sinon.stub(Progreso, "create").callsFake(async (datos) => {
      datosProgresoCreado = datos;
      return { _id: new mongoose.Types.ObjectId(), ...datos };
    });

    sinon.stub(Usuario, "findByIdAndUpdate").resolves({});

    // Act
    await habitoPrototype.clonarHabito(
      habitoOriginalMock._id,
      "usuario123"
    );

    // Assert
    expect(datosProgresoCreado).to.exist;
    expect(datosProgresoCreado.progreso).to.equal(0); // Reiniciado a 0
    expect(datosProgresoCreado.frecuencia).to.equal(5);
    expect(datosProgresoCreado.periodo).to.equal("diario");
  });

  // CP-14: Formateo y envío de notificación por correo (EmailAdapter)
  it("CP-14: Debe formatear correctamente destinatario, asunto y cuerpo al enviar recordatorio por email", async () => {
    // Arrange
    const adapter = new EmailAdapter();
    const sendMailStub = sinon.stub(adapter.transporter, "sendMail").resolves({
      messageId: "mock-123",
    });

    const mockUsuario = { correo: "persona@example.test" };
    const mockHabito = { nombre: "Beber 2L de agua" };

    // Act
    await adapter.enviar(mockUsuario, mockHabito);

    // Assert
    expect(sendMailStub.calledOnce).to.be.true;
    const llamada = sendMailStub.firstCall.args[0];
    expect(llamada.to).to.equal("persona@example.test");
    expect(llamada.subject).to.equal("Recordatorio de hábito");
    expect(llamada.text).to.include("Beber 2L de agua");
  });

  // CP-15: Envío seguro de notificación con TelegramAdapter
  it("CP-15: Debe estructurar el mensaje de recordatorio y no realizar peticiones reales si se mockea el bot", async () => {
    // Arrange
    const adapter = new TelegramAdapter();
    const sendMessageStub = sinon.stub(adapter.bot, "sendMessage").resolves({
      message_id: 999,
    });

    const mockUsuario = { nombre: "Carlos" };
    const mockHabito = { nombre: "Meditación 10 min" };

    // Act
    await adapter.enviar(mockUsuario, mockHabito);

    // Assert
    expect(sendMessageStub.calledOnce).to.be.true;
    const mensajeEnviado = sendMessageStub.firstCall.args[1];
    expect(mensajeEnviado).to.include("Meditación 10 min");
    expect(mensajeEnviado).to.include("Recuerda completar tu hábito");
  });
});
