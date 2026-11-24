import { formatearPesos } from '../utils/formato';

// Tarjeta de producto reutilizable. Lo que cambia (botones, desglose de precio)
// entra como `children`, así el catálogo y el panel comparten el mismo diseño.
export default function TarjetaProducto({ producto, children }) {
  return (
    <article className="product-card">
      <span className="cat-tag">{producto.categoria}</span>
      <h3>{producto.nombre}</h3>
      <p className="meta">{producto.productorNombre} · {producto.municipio}</p>

      <div className="price-row">
        <span className="price">{formatearPesos(producto.precio)}</span>
        <span className="unit">por {producto.unidad} · {producto.cantidad} disp.</span>
      </div>

      {children}
    </article>
  );
}
