import { useCallback, useEffect, useState } from 'react';
import Campo from '../componentes/Campo';
import TarjetaProducto from '../componentes/TarjetaProducto';
import useCatalogos from '../hooks/useCatalogos';
import { crearProducto, eliminarProducto, listarProductos } from '../api';
import { useSesion } from '../contexto/SesionContext';

const VACIO = { nombre: '', categoria: '', municipio: '', precio: '', unidad: '', cantidad: '' };

export default function PanelProductor() {
  const { usuario } = useSesion();
  const { catalogos } = useCatalogos();
  const [valores, setValores] = useState(VACIO);
  const [misProductos, setMisProductos] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setMisProductos(await listarProductos({ productorId: usuario.id }));
    } catch (e) {
      setError(e.message);
    }
  }, [usuario.id]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = (campo) => (valor) => setValores({ ...valores, [campo]: valor });

  async function publicar(evento) {
    evento.preventDefault();
    setError('');
    setExito('');
    setEnviando(true);
    try {
      await crearProducto({ ...valores, productorId: usuario.id, productorNombre: usuario.nombre });
      setExito('¡Producto publicado! Ya aparece en el catálogo.');
      setValores(VACIO);
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function quitar(id) {
    try {
      await eliminarProducto(id, usuario.id);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Tu finca en CampoDirecto</span>
        <h1>Panel del productor</h1>
        <p>Publica lo que tienes disponible y gestiona lo que ya está en el catálogo.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{misProductos.length}</span>
          <span className="stat-label">Productos publicados</span>
        </div>
        <div className="stat-card muted">
          <span className="stat-value">—</span>
          <span className="stat-label">Pedidos recibidos (próximamente)</span>
        </div>
        <div className="stat-card muted">
          <span className="stat-value">—</span>
          <span className="stat-label">Calificación promedio (próximamente)</span>
        </div>
      </div>

      <div className="panel-layout">
        <section className="form-card">
          <h2>Publicar producto</h2>
          <form onSubmit={publicar} noValidate>
            <Campo id="nombre" etiqueta="Nombre del producto" valor={valores.nombre}
              onCambio={cambiar('nombre')} placeholder="Ej. Tomate chonto" />
            <div className="form-row">
              <Campo id="categoria" etiqueta="Categoría" valor={valores.categoria}
                onCambio={cambiar('categoria')} opciones={catalogos?.categorias ?? []} />
              <Campo id="municipio" etiqueta="Municipio" valor={valores.municipio}
                onCambio={cambiar('municipio')} opciones={catalogos?.municipios ?? []} />
            </div>
            <div className="form-row">
              <Campo id="precio" etiqueta="Precio" tipo="number" min="0" valor={valores.precio}
                onCambio={cambiar('precio')} placeholder="2500" />
              <Campo id="unidad" etiqueta="Unidad" valor={valores.unidad}
                onCambio={cambiar('unidad')} opciones={catalogos?.unidades ?? []} />
            </div>
            <Campo id="cantidad" etiqueta="Cantidad disponible" tipo="number" min="0" valor={valores.cantidad}
              onCambio={cambiar('cantidad')} placeholder="100" />

            {exito && <div className="form-message success" role="status">{exito}</div>}
            {error && <div className="form-message error" role="alert">{error}</div>}

            <button type="submit" className="boton-principal" disabled={enviando}>
              <span>{enviando ? 'Publicando...' : 'Publicar producto'}</span>
              <span>→</span>
            </button>
          </form>
        </section>

        <section className="my-products">
          <h2>Tus productos {misProductos.length > 0 && <span>({misProductos.length})</span>}</h2>

          {misProductos.length === 0 && (
            <div className="empty-state">
              <p>Todavía no has publicado ningún producto. Usa el formulario para crear el primero.</p>
            </div>
          )}

          <div className="my-product-list">
            {misProductos.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto}>
                <button type="button" className="delete-btn" onClick={() => quitar(producto.id)}>Eliminar</button>
              </TarjetaProducto>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
