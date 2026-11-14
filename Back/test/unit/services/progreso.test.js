const { expect } = require("chai");
const sinon = require("sinon");

const ProgresoDiario = require("../../../src/services/progreso/strategies/ProgresoDiario");
const ProgresoSemanal = require("../../../src/services/progreso/strategies/ProgresoSemanal");
const ProgresoMensual = require("../../../src/services/progreso/strategies/ProgresoMensual");
const ProgresoBridge = require("../../../src/services/progreso/strategies/ProgresoBridge");
const ProgresoProxy = require("../../../src/services/progreso/proxy/ProgresoProxy");
const Progreso = require("../../../src/models/progresoHabito.model");

describe("Módulo de Cálculo de Progreso y Estrategias (CP-01 a CP-06)", () => {
  describe("Estrategias de Progreso (Cálculo de Límites)", () => {
    // CP-01: Límite diario
    it("CP-01: Debe calcular correctamente el límite de progreso diario según la frecuencia", () => {
      // Arrange
      const estrategia = new ProgresoDiario();
      const mockProgreso = { frecuencia: 3, periodo: "diario" };

      // Act
      const limite = estrategia.calcularLimite(mockProgreso);

      // Assert
      expect(limite).to.equal(3);
    });

    // CP-02: Límite semanal
    it("CP-02: Debe calcular el límite semanal priorizando frecuenciaSemanal sobre frecuencia diaria", () => {
      // Arrange
      const estrategia = new ProgresoSemanal();
      const mockProgreso = {
        frecuencia: 2,
        frecuenciaSemanal: 5,
        periodo: "semanal",
      };

      // Act
      const limite = estrategia.calcularLimite(mockProgreso);

      // Assert
      expect(limite).to.equal(5);
    });

    // CP-03: Límite mensual
    it("CP-03: Debe calcular correctamente el límite de progreso mensual", () => {
      // Arrange
      const estrategia = new ProgresoMensual();
      const mockProgreso = { frecuencia: 12, periodo: "mensual" };

      // Act
      const limite = estrategia.calcularLimite(mockProgreso);

      // Assert
      expect(limite).to.equal(12);
    });

    // CP-04: Periodo no soportado en Bridge
    it("CP-04: Debe lanzar una excepción cuando se solicita una estrategia con periodo no soportado", () => {
      // Arrange
      const periodoInvalido = "anual";

      // Act & Assert
      expect(() => {
        ProgresoBridge.obtenerStrategy(periodoInvalido);
      }).to.throw("Tipo de progreso no soportado");
    });
  });

  describe("Control de Acceso y Límites con ProgresoProxy", () => {
    let findOneStub;

    afterEach(() => {
      sinon.restore();
    });

    // CP-05: Permitir incremento cuando progreso actual < límite
    it("CP-05: Debe permitir el incremento cuando el progreso actual es menor que la meta", async () => {
      // Arrange
      const proxy = new ProgresoProxy();
      const mockProgreso = {
        habito: "habito123",
        periodo: "diario",
        frecuencia: 3,
        progreso: 1, // 1 < 3
      };

      findOneStub = sinon.stub(Progreso, "findOne").resolves(mockProgreso);
      const serviceStub = sinon
        .stub(proxy.service, "actualizar")
        .resolves({ progreso: { ...mockProgreso, progreso: 2 }, limite: 3 });

      // Act
      const resultado = await proxy.actualizar("habito123", "usuario001");

      // Assert
      expect(findOneStub.calledOnce).to.be.true;
      expect(serviceStub.calledOnce).to.be.true;
      expect(resultado.progreso.progreso).to.equal(2);
    });

    // CP-06: Bloquear incremento cuando el límite fue alcanzado
    it("CP-06: Debe bloquear el incremento y lanzar error cuando ya se alcanzó el límite", async () => {
      // Arrange
      const proxy = new ProgresoProxy();
      const mockProgreso = {
        habito: "habito123",
        periodo: "diario",
        frecuencia: 3,
        progreso: 3, // límite alcanzado
      };

      sinon.stub(Progreso, "findOne").resolves(mockProgreso);
      const serviceSpy = sinon.spy(proxy.service, "actualizar");

      // Act & Assert
      try {
        await proxy.actualizar("habito123", "usuario001");
        expect.fail("Debería haber lanzado un error");
      } catch (error) {
        expect(error.message).to.equal("El hábito ya está completado");
        expect(serviceSpy.called).to.be.false;
      }
    });
  });
});
