import { useState } from 'react';

// Campo de formulario reutilizable: etiqueta + input (o select si recibe `opciones`) + error.
// Lo que cambia entre un uso y otro entra como prop.
export default function Campo({ id, etiqueta, tipo = 'text', valor, onCambio, error, opciones, ...resto }) {
  const [visible, setVisible] = useState(false);
  const esContrasena = tipo === 'password';
  const clase = error ? 'input-error' : '';

  return (
    <div className="form-group">
      <label htmlFor={id}>{etiqueta}</label>

      {opciones ? (
        <select id={id} value={valor} onChange={(e) => onCambio(e.target.value)} className={clase} {...resto}>
          <option value="">Selecciona…</option>
          {opciones.map((opcion) => (
            <option key={opcion} value={opcion}>{opcion}</option>
          ))}
        </select>
      ) : (
        <div className="campo-envoltorio">
          <input
            id={id}
            type={esContrasena && visible ? 'text' : tipo}
            value={valor}
            onChange={(e) => onCambio(e.target.value)}
            className={clase}
            {...resto}
          />
          {esContrasena && (
            <button type="button" className="mostrar" onClick={() => setVisible(!visible)}>
              {visible ? 'Ocultar' : 'Mostrar'}
            </button>
          )}
        </div>
      )}

      <small className="error-message">{error}</small>
    </div>
  );
}
