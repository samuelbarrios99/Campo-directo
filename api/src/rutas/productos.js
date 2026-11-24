// Esta capa solo recibe y responde: las decisiones viven en logica/ y datos/.
const express = require('express');
const repositorio = require('../datos/repositorio-productos');
const {
  esCantidadValida, validarProducto, normalizarProducto,
  calcularPrecioTransparente, filtrarProductos, calcularResumen
} = require('../logica/reglas-productos');
const { CANTIDAD_MINIMA } = require('../config/constantes');
const { responder, responderError } = require('../utils/respuestas');
const envolver = require('../utils/envolver');

const router = express.Router();

// Lista los productos disponibles. Filtros opcionales: ?categoria= &municipio= &texto=
router.get('/', envolver(async (req, res) => {
  const productos = await repositorio.listar();
  responder(res, 200, filtrarProductos(productos, req.query));
}));

// Resumen calculado: cuántos hay, precio promedio y conteo por categoría.
router.get('/resumen', envolver(async (req, res) => {
  const productos = await repositorio.listar();
  responder(res, 200, calcularResumen(productos));
}));

// Precio transparente de un producto: precio del productor + transporte estimado.
router.get('/:id/precio-total', envolver(async (req, res) => {
  const producto = await repositorio.buscarPorId(req.params.id);
  if (!producto) return responderError(res, 404, 'El producto no existe');

  const cantidad = req.query.cantidad === undefined ? CANTIDAD_MINIMA : req.query.cantidad;
  if (!esCantidadValida(cantidad)) {
    return responderError(res, 400, `La cantidad debe ser un número de al menos ${CANTIDAD_MINIMA}`);
  }

  responder(res, 200, calcularPrecioTransparente(producto.precio, Number(cantidad)));
}));

// Publica un producto. Valida SIEMPRE en el servidor.
router.post('/', envolver(async (req, res) => {
  const { valido, errores } = validarProducto(req.body);
  if (!valido) return responderError(res, 400, 'Datos del producto inválidos', errores);

  const creado = await repositorio.crear(normalizarProducto(req.body));
  responder(res, 201, creado);
}));

// Elimina un producto. Solo su dueño puede hacerlo.
// OJO: sin tokens de sesión, productorId viaja en la URL y se podría falsificar.
// Es una protección provisional hasta que haya autenticación real.
router.delete('/:id', envolver(async (req, res) => {
  const producto = await repositorio.buscarPorId(req.params.id);
  if (!producto) return responderError(res, 404, 'El producto no existe');

  if (!producto.productorId || producto.productorId !== req.query.productorId) {
    return responderError(res, 403, 'Solo el productor dueño puede eliminar este producto');
  }

  await repositorio.eliminar(req.params.id);
  responder(res, 200, { eliminado: true });
}));

module.exports = router;
