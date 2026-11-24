import { useEffect, useState } from 'react';
import TarjetaProducto from '../componentes/TarjetaProducto';
import DesglosePrecio from '../componentes/DesglosePrecio';
import useCatalogos from '../hooks/useCatalogos';
import { listarProductos, obtenerResumen } from '../api';
import { formatearPesos } from '../utils/formato';

const ORDENES = {
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio
};

export default function Catalogo() {
  const [filtros, setFiltros] = useState({ texto: '', categoria: '', municipio: '' });
  const [orden, setOrden] = useState('');
  const [productos, setProductos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { catalogos } = useCatalogos();

  useEffect(() => {
    obtenerResumen().then(setResumen).catch(() => setResumen(null));
  }, []);

  // Cada cambio de filtro vuelve a pedir la lista a la API (con una pequeña pausa al escribir).
  useEffect(() => {
    let cancelado = false;
    const temporizador = setTimeout(async () => {
      setCargando(true);
      try {
        const datos = await listarProductos(filtros);
        if (!cancelado) { setProductos(datos); setError(''); }
      } catch (e) {
        if (!cancelado) setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }, 250);
    return () => { cancelado = true; clearTimeout(temporizador); };
  }, [filtros]);

  const cambiar = (campo) => (evento) => setFiltros({ ...filtros, [campo]: evento.target.value });
  const visibles = orden ? [...productos].sort(ORDENES[orden]) : productos;

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Atlántico · Oferta disponible</span>
        <h1>Catálogo de productos</h1>
        <p>
          Precio del productor a la vista, siempre.
          {resumen && ` ${resumen.totalProductos} productos disponibles · precio promedio ${formatearPesos(resumen.precioPromedio)}.`}
        </p>
      </div>

      <div className="filters">
        <input type="text" placeholder="Buscar producto…" value={filtros.texto} onChange={cambiar('texto')} />
        <select value={filtros.categoria} onChange={cambiar('categoria')}>
          <option value="">Todas las categorías</option>
          {catalogos?.categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtros.municipio} onChange={cambiar('municipio')}>
          <option value="">Todos los municipios</option>
          {catalogos?.municipios.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="">Orden por defecto</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>

      {error && <div className="form-message error" role="alert">{error}</div>}
      {cargando && <p className="results-count">Cargando productos…</p>}

      {!cargando && !error && visibles.length === 0 && (
        <div className="empty-state"><p>No encontramos productos con esos filtros.</p></div>
      )}

      <div className="product-grid">
        {visibles.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto}>
            <DesglosePrecio productoId={producto.id} />
          </TarjetaProducto>
        ))}
      </div>
    </>
  );
}
