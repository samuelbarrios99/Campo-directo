import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SesionProvider } from './contexto/SesionContext';
import RutaProtegida from './componentes/RutaProtegida';
import LayoutApp from './componentes/LayoutApp';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Catalogo from './paginas/Catalogo';
import PanelProductor from './paginas/PanelProductor';

// HashRouter: las rutas viven después del "#", así el sitio funciona en S3
// sin configurar redirecciones (BrowserRouter da 404 al recargar una ruta interna).
export default function App() {
  return (
    <HashRouter>
      <SesionProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route element={<RutaProtegida />}>
            <Route element={<LayoutApp />}>
              <Route path="/catalogo" element={<Catalogo />} />
              <Route element={<RutaProtegida rol="productor" />}>
                <Route path="/panel" element={<PanelProductor />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SesionProvider>
    </HashRouter>
  );
}
