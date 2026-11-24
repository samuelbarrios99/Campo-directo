// Las contraseñas nunca se guardan tal cual: se guarda sal + hash (scrypt, incluido en Node).
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const { LARGO_SAL_BYTES, LARGO_CLAVE_BYTES } = require('../config/constantes');

const scryptAsync = promisify(scrypt);

async function hashearContrasena(contrasena) {
  const sal = randomBytes(LARGO_SAL_BYTES).toString('hex');
  const clave = await scryptAsync(contrasena, sal, LARGO_CLAVE_BYTES);
  return `${sal}:${clave.toString('hex')}`;
}

async function verificarContrasena(contrasena, guardado) {
  const [sal, hashGuardado] = guardado.split(':');
  const clave = await scryptAsync(contrasena, sal, LARGO_CLAVE_BYTES);
  const esperado = Buffer.from(hashGuardado, 'hex');
  return esperado.length === clave.length && timingSafeEqual(esperado, clave);
}

module.exports = { hashearContrasena, verificarContrasena };
