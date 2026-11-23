// src/components/common/ModalRegistroUsuario.jsx
import { useState } from 'react';
import { registrarUsuario } from '../../service/usuarioService';

function ModalRegistroUsuario({ mostrar, cerrarModal, abrirModalInicioSesion }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    edad: '',
    telefono: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let valorLimpio = value;

    // Restricciones en tiempo real para evitar caracteres inválidos
    if (name === 'telefono') {
      // Solo permite dígitos numéricos (0-9) y máximo 10 caracteres (número celular estándar)
      valorLimpio = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'edad') {
      // Solo permite dígitos numéricos y máximo 3 dígitos
      valorLimpio = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'nombre') {
      // Permite letras, espacios, acentos y guiones (bloquea números y símbolos)
      valorLimpio = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
    }

    setDatosFormulario({
      ...datosFormulario,
      [name]: valorLimpio
    });

    // Limpiar errores cuando el usuario escribe
    if (error) setError('');
    if (exito) setExito('');
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones estrictas antes de enviar
    const nombreLimpio = datosFormulario.nombre.trim();
    if (nombreLimpio.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(datosFormulario.correo.trim())) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (datosFormulario.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const edadNum = parseInt(datosFormulario.edad, 10);
    if (isNaN(edadNum) || edadNum < 18 || edadNum > 120) {
      setError('Debes ingresar una edad válida entre 18 y 120 años.');
      return;
    }

    if (!/^\d{7,10}$/.test(datosFormulario.telefono)) {
      setError('El número de teléfono debe contener solo números (entre 7 y 10 dígitos).');
      return;
    }

    setCargando(true);

    // Llamar al servicio de registro
    const resultado = await registrarUsuario(
      nombreLimpio,
      datosFormulario.correo.trim().toLowerCase(),
      datosFormulario.contrasena,
      String(edadNum),
      datosFormulario.telefono
    );

    if (resultado.success) {
      // Registro exitoso
      setExito('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      
      // Limpiar formulario
      setDatosFormulario({
        nombre: '',
        correo: '',
        contrasena: '',
        edad: '',
        telefono: ''
      });
      
      // Cerrar modal de registro y abrir modal de inicio de sesión después de 1.8 segundos
      setTimeout(() => {
        cerrarModal();
        if (abrirModalInicioSesion) {
          abrirModalInicioSesion();
        }
      }, 1800);
    } else {
      // Mostrar mensaje de error del backend
      setError(resultado.message || 'Error al registrar el usuario');
    }

    setCargando(false);
  };

  const irAInicioSesion = () => {
    cerrarModal();
    if (abrirModalInicioSesion) {
      abrirModalInicioSesion();
    }
  };

  if (!mostrar) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1050
      }}
    >
      <div
        className="bg-white rounded-4 shadow p-4 position-relative"
        style={{ width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-label="Registrarse"
        data-testid="modal-registro"
      >
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={cerrarModal}
          aria-label="Cerrar"
          disabled={cargando}
        ></button>

        <div className="text-center mb-4 mt-2">
          <h2 className="fw-bold">Registrarse</h2>
          <p className="text-muted mb-0">Crea tu cuenta para comenzar</p>
        </div>

        {/* Mensaje de éxito */}
        {exito && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
            data-testid="registro-alert-exito"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {exito}
            <button
              type="button"
              className="btn-close"
              onClick={() => setExito('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
            data-testid="registro-alert-error"
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              placeholder="Ingrese su nombre completo"
              value={datosFormulario.nombre}
              onChange={manejarCambio}
              required
              disabled={cargando}
              autoComplete="name"
            />
            <small className="text-muted">Solo letras y espacios</small>
          </div>

          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo electrónico <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={datosFormulario.correo}
              onChange={manejarCambio}
              required
              disabled={cargando}
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contrasena" className="form-label">
              Contraseña <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="contrasena"
              name="contrasena"
              placeholder="Mínimo 6 caracteres"
              value={datosFormulario.contrasena}
              onChange={manejarCambio}
              required
              disabled={cargando}
              minLength="6"
              autoComplete="new-password"
            />
            <small className="text-muted">Mínimo 6 caracteres</small>
          </div>

          <div className="mb-3">
            <label htmlFor="edad" className="form-label">
              Edad <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="3"
              className="form-control"
              id="edad"
              name="edad"
              placeholder="Ej: 25"
              value={datosFormulario.edad}
              onChange={manejarCambio}
              required
              disabled={cargando}
            />
            <small className="text-muted">Debe ser mayor de 18 años (solo números)</small>
          </div>

          <div className="mb-4">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="10"
              className="form-control"
              id="telefono"
              name="telefono"
              placeholder="Ej: 3001234567"
              value={datosFormulario.telefono}
              onChange={manejarCambio}
              required
              disabled={cargando}
              autoComplete="tel"
            />
            <small className="text-muted">Solo números (entre 7 y 10 dígitos, sin espacios ni letras)</small>
          </div>

          <div className="d-grid mb-3">
            <button 
              type="submit" 
              className="btn btn-primary py-2 fw-semibold"
              disabled={cargando}
            >
              {cargando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>

          <p className="text-center mb-0">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={irAInicioSesion}
              disabled={cargando}
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ModalRegistroUsuario;
