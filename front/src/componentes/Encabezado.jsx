import { NavLink, useNavigate } from 'react-router-dom';
import { useSesion } from '../contexto/SesionContext';

export default function Encabezado() {
  const { usuario, cerrar } = useSesion();
  const navegar = useNavigate();

  function salir() {
    cerrar();
    navegar('/login');
  }

  return (
    <header className="app-header">
      <div className="envoltorio">
        <span className="app-logo">CampoDirecto<span>.</span></span>

        <nav className="app-nav">
          <NavLink to="/catalogo">Catálogo</NavLink>
          {usuario.rol === 'productor' && <NavLink to="/panel">Panel del productor</NavLink>}
        </nav>

        <div className="app-user">
          <span className="nombre">{usuario.nombre.split(' ')[0]}</span>
          <span className={`role-pill ${usuario.rol}`}>{usuario.rol}</span>
          <button className="btn" onClick={salir}>Cerrar sesión</button>
        </div>
      </div>
    </header>
  );
}
