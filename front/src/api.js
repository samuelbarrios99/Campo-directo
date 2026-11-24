const BASE = import.meta.env.VITE_API_URL;

function armarConsulta(filtros = {}) {
  const parametros = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') parametros.set(clave, valor);
  });
  const texto = parametros.toString();
  return texto ? `?${texto}` : '';
}

// Único punto donde se hace fetch: si algo falla, el mensaje que manda la API llega al usuario.
async function pedir(ruta, opciones = {}) {
  const cabeceras = opciones.body ? { 'Content-Type': 'application/json' } : {};
  const respuesta = await fetch(`${BASE}${ruta}`, { headers: cabeceras, ...opciones });
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const detalles = datos?.detalles ? `: ${datos.detalles.join('. ')}` : '';
    throw new Error((datos?.error || 'No se pudo conectar con el servidor') + detalles);
  }
  return datos;
}

const enviarJson = (metodo, cuerpo) => ({ method: metodo, body: JSON.stringify(cuerpo) });

export const obtenerCatalogos = () => pedir('/catalogos');
export const listarProductos = (filtros) => pedir(`/productos${armarConsulta(filtros)}`);
export const obtenerResumen = () => pedir('/productos/resumen');
export const obtenerPrecioTotal = (id, cantidad) =>
  pedir(`/productos/${id}/precio-total${armarConsulta({ cantidad })}`);
export const crearProducto = (producto) => pedir('/productos', enviarJson('POST', producto));
export const eliminarProducto = (id, productorId) =>
  pedir(`/productos/${id}${armarConsulta({ productorId })}`, { method: 'DELETE' });
export const registrarUsuario = (datos) => pedir('/usuarios/registro', enviarJson('POST', datos));
export const iniciarSesion = (datos) => pedir('/usuarios/login', enviarJson('POST', datos));
