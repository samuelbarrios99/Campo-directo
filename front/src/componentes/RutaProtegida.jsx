import { Navigate, Outlet } from 'react-router-dom';
import { useSesion, rutaInicial } from '../contexto/SesionContext';

// Sin sesión → login. Con sesión pero rol equivocado → a su página de inicio.
// (Es una guía de interfaz: la seguridad real está en la validación del servidor.)
export default function RutaProtegida({ rol }) {
  const { usuario } = useSesion();

  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.rol !== rol) return <Navigate to={rutaInicial(usuario)} replace />;
  return <Outlet />;
}
