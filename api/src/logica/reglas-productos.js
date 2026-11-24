// Reglas del negocio de productos. Esta capa NO sabe que existe HTTP:
// por eso se puede probar sin levantar el servidor.
const {
  CATEGORIAS, MUNICIPIOS, UNIDADES, ESTADO_DISPONIBLE,
  LARGO_MINIMO_NOMBRE, PRECIO_MINIMO, CANTIDAD_MINIMA,
  TRANSPORTE_ESTIMADO_PORCENTAJE
} = require('../config/constantes');

function esNumeroDesde(valor, minimo) {
  const esTextoNumerico = typeof valor === 'string' && valor.trim() !== '';
  if (typeof valor !== 'number' && !esTextoNumerico) return false;
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= minimo;
}

function esCantidadValida(valor) {
  return esNumeroDesde(valor, CANTIDAD_MINIMA);
}

// Devuelve { valido, errores }: cada error dice QUÉ está mal, no solo "error 400".
function validarProducto(datos) {
  const errores = [];
  const d = datos || {};

  if (typeof d.nombre !== 'string' || d.nombre.trim().length < LARGO_MINIMO_NOMBRE) {
    errores.push(`El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres`);
  }
  if (!CATEGORIAS.includes(d.categoria)) {
    errores.push(`La categoría debe ser una de: ${CATEGORIAS.join(', ')}`);
  }
  if (!MUNICIPIOS.includes(d.municipio)) {
    errores.push(`El municipio debe ser uno de: ${MUNICIPIOS.join(', ')}`);
  }
  if (!UNIDADES.includes(d.unidad)) {
    errores.push(`La unidad debe ser una de: ${UNIDADES.join(', ')}`);
  }
  if (!esNumeroDesde(d.precio, PRECIO_MINIMO)) {
    errores.push(`El precio debe ser un número de al menos ${PRECIO_MINIMO}`);
  }
  if (!esCantidadValida(d.cantidad)) {
    errores.push(`La cantidad debe ser un número de al menos ${CANTIDAD_MINIMA}`);
  }
  if (typeof d.productorId !== 'string' && typeof d.productorId !== 'number') {
    errores.push('Falta el productorId');
  }
  if (typeof d.productorNombre !== 'string' || d.productorNombre.trim() === '') {
    errores.push('Falta el productorNombre');
  }

  return { valido: errores.length === 0, errores };
}

// Solo copia los campos conocidos: evita que alguien meta datos extra en el POST.
function normalizarProducto(datos) {
  return {
    productorId: String(datos.productorId),
    productorNombre: datos.productorNombre.trim(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    municipio: datos.municipio,
    precio: Number(datos.precio),
    unidad: datos.unidad,
    cantidad: Number(datos.cantidad)
  };
}

// Precio transparente: lo que cobra el productor + el transporte estimado, por separado.
function calcularPrecioTransparente(precio, cantidad = CANTIDAD_MINIMA) {
  const transporteEstimado = Math.round(precio * TRANSPORTE_ESTIMADO_PORCENTAJE);
  const totalUnitario = precio + transporteEstimado;
  return {
    precioProductor: precio,
    transporteEstimado,
    totalUnitario,
    cantidad,
    total: totalUnitario * cantidad
  };
}

// Solo productos disponibles; los filtros (categoria, municipio, texto, productorId) son opcionales.
function filtrarProductos(productos, filtros = {}) {
  const { categoria, municipio, texto, productorId } = filtros;
  const buscado = texto ? String(texto).trim().toLowerCase() : '';

  return productos.filter((p) => {
    if (p.estado !== ESTADO_DISPONIBLE) return false;
    if (categoria && p.categoria !== categoria) return false;
    if (municipio && p.municipio !== municipio) return false;
    if (productorId && p.productorId !== productorId) return false;
    if (buscado && !p.nombre.toLowerCase().includes(buscado)) return false;
    return true;
  });
}

function calcularResumen(productos) {
  const disponibles = productos.filter((p) => p.estado === ESTADO_DISPONIBLE);
  const porCategoria = {};
  let sumaPrecios = 0;

  disponibles.forEach((p) => {
    porCategoria[p.categoria] = (porCategoria[p.categoria] || 0) + 1;
    sumaPrecios += p.precio;
  });

  return {
    totalProductos: disponibles.length,
    precioPromedio: disponibles.length ? Math.round(sumaPrecios / disponibles.length) : 0,
    porCategoria
  };
}

module.exports = {
  esCantidadValida, validarProducto, normalizarProducto,
  calcularPrecioTransparente, filtrarProductos, calcularResumen
};
