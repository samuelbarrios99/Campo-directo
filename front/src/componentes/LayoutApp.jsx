import { Outlet } from 'react-router-dom';
import Encabezado from './Encabezado';

// Marco de las páginas con sesión: encabezado arriba y la página debajo.
export default function LayoutApp() {
  return (
    <>
      <Encabezado />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
