function PiePagina() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h2 className="h5 fw-bold">Habits UP</h2>
            <p className="text-light opacity-75">
              Impulsamos el desarrollo de hábitos positivos para mejorar la salud,
              la productividad y el bienestar personal.
            </p>
          </div>

          <div className="col-md-4">
            <h2 className="h5 fw-bold">Contáctanos</h2>
            <p className="mb-1 text-light opacity-75">Teléfono: +57 300 123 4567</p>
            <p className="mb-1 text-light opacity-75">Correo: contacto@habitsup.com</p>
            <p className="mb-0 text-light opacity-75">Valledupar, Colombia</p>
          </div>

          <div className="col-md-4">
            <h2 className="h5 fw-bold">Redes sociales</h2>
            <p className="mb-1 text-light opacity-75">Facebook: Habits UP</p>
            <p className="mb-1 text-light opacity-75">Instagram: @habitsup</p>
            <p className="mb-1 text-light opacity-75">X: @habitsup</p>
            <p className="mb-0 text-light opacity-75">LinkedIn: Habits UP</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-light opacity-75">
          <small>© 2026 Habits UP. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}

export default PiePagina;
