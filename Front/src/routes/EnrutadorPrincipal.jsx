import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PaginaPrincipal from '../pages/PaginaPrincipal';
import PanelPrincipal from '../pages/PanelPrincipal';

function RutaProtegida({ children }) {
  const usuarioRaw = localStorage.getItem('usuario');
  let usuario = null;
  try {
    usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  } catch {
    usuario = null;
  }

  if (!usuario || !usuario._id) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function EnrutadorPrincipal() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
        <Route
          path="/panel-principal"
          element={
            <RutaProtegida>
              <PanelPrincipal />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default EnrutadorPrincipal;
