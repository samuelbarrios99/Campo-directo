// Única fuente de verdad para listas y umbrales.
// Si una regla cambia, cambia aquí y en ninguna otra parte.

const CATEGORIAS = [
  'Agrícola', 'Pecuario', 'Apícola', 'Avícola',
  'Pesca', 'Frutas y verduras', 'Artesanías rurales'
];

const MUNICIPIOS = [
  'Barranquilla', 'Soledad', 'Malambo', 'Galapa', 'Puerto Colombia'
];

const UNIDADES = ['kg', 'libra', 'unidad', 'docena', 'litro', 'atado'];

const ROLES = ['productor', 'comprador'];

const ESTADO_DISPONIBLE = 'disponible';

const LARGO_MINIMO_NOMBRE = 3;
const LARGO_MINIMO_CONTRASENA = 6;
const LARGO_MINIMO_TELEFONO = 7;
const PRECIO_MINIMO = 1;      // pesos; el precio debe ser mayor que cero
const CANTIDAD_MINIMA = 1;

// Estimación del transporte mientras no exista el módulo de transporte (fase 2):
// 12 % del precio del productor. Con $2.500/kg da los $300/kg que muestra la landing.
const TRANSPORTE_ESTIMADO_PORCENTAJE = 0.12;

// Parámetros técnicos del hash de contraseñas (scrypt)
const LARGO_SAL_BYTES = 16;
const LARGO_CLAVE_BYTES = 64;

module.exports = {
  CATEGORIAS, MUNICIPIOS, UNIDADES, ROLES, ESTADO_DISPONIBLE,
  LARGO_MINIMO_NOMBRE, LARGO_MINIMO_CONTRASENA, LARGO_MINIMO_TELEFONO,
  PRECIO_MINIMO, CANTIDAD_MINIMA, TRANSPORTE_ESTIMADO_PORCENTAJE,
  LARGO_SAL_BYTES, LARGO_CLAVE_BYTES
};
