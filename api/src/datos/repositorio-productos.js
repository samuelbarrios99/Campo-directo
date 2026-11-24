// De dónde salen y dónde se guardan los productos.
// Hoy viven en memoria; todas las funciones son async a propósito: cuando esto
// pase a MySQL solo cambia este archivo, no las rutas ni la lógica.
const { randomUUID } = require('crypto');
const { productosIniciales } = require('./semilla');
const { ESTADO_DISPONIBLE } = require('../config/constantes');

let productos = productosIniciales.map((p) => ({
  id: randomUUID(),
  productorId: null,
  estado: ESTADO_DISPONIBLE,
  fechaPublicacion: new Date().toISOString(),
  ...p
}));

async function listar() {
  return [...productos];
}

async function buscarPorId(id) {
  return productos.find((p) => p.id === id) || null;
}

async function crear(datos) {
  const nuevo = {
    id: randomUUID(),
    estado: ESTADO_DISPONIBLE,
    fechaPublicacion: new Date().toISOString(),
    ...datos
  };
  productos.unshift(nuevo);
  return nuevo;
}

async function eliminar(id) {
  const antes = productos.length;
  productos = productos.filter((p) => p.id !== id);
  return productos.length < antes;
}

module.exports = { listar, buscarPorId, crear, eliminar };
