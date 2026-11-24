import { useState } from 'react';
import { obtenerPrecioTotal } from '../api';
import { formatearPesos } from '../utils/formato';

// Pide a la API el precio transparente. El cálculo NO se hace aquí: vive en el back,
// así el front no puede contradecirlo.
export default function DesglosePrecio({ productoId }) {
  const [cantidad, setCantidad] = useState('1');
  const [desglose, setDesglose] = useState(null);
  const [error, setError] = useState('');

  async function calcular() {
    try {
      setError('');
      setDesglose(await obtenerPrecioTotal(productoId, cantidad));
    } catch (e) {
      setDesglose(null);
      setError(e.message);
    }
  }

  return (
    <div className="desglose">
      <div className="desglose-controles">
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          aria-label="Cantidad"
        />
        <button type="button" className="cta" onClick={calcular}>Ver precio total</button>
      </div>

      {error && <small className="error-message">{error}</small>}

      {desglose && (
        <dl className="desglose-filas">
          <div><dt>Precio del productor</dt><dd>{formatearPesos(desglose.precioProductor)}</dd></div>
          <div><dt>Transporte estimado</dt><dd>+ {formatearPesos(desglose.transporteEstimado)}</dd></div>
          <div className="total"><dt>Total ({desglose.cantidad})</dt><dd>{formatearPesos(desglose.total)}</dd></div>
        </dl>
      )}
    </div>
  );
}
