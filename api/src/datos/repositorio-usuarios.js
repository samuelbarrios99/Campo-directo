const { randomUUID } = require('crypto');

let usuarios = [];

async function buscarPorCorreo(correo) {
  return usuarios.find((u) => u.correo === correo) || null;
}

async function crear(datos) {
  const nuevo = {
    id: randomUUID(),
    estado: 'activo',
    fechaRegistro: new Date().toISOString(),
    ...datos
  };
  usuarios.push(nuevo);
  return nuevo;
}

module.exports = { buscarPorCorreo, crear };
