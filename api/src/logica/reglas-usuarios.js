const {
  ROLES, LARGO_MINIMO_NOMBRE, LARGO_MINIMO_CONTRASENA, LARGO_MINIMO_TELEFONO
} = require('../config/constantes');

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarRegistro(datos) {
  const errores = [];
  const d = datos || {};

  if (typeof d.nombre !== 'string' || d.nombre.trim().length < LARGO_MINIMO_NOMBRE) {
    errores.push(`El nombre debe tener al menos ${LARGO_MINIMO_NOMBRE} caracteres`);
  }
  if (typeof d.correo !== 'string' || !PATRON_CORREO.test(d.correo.trim())) {
    errores.push('El correo no es válido');
  }
  if (typeof d.telefono !== 'string' || d.telefono.trim().length < LARGO_MINIMO_TELEFONO) {
    errores.push(`El teléfono debe tener al menos ${LARGO_MINIMO_TELEFONO} caracteres`);
  }
  if (!ROLES.includes(d.rol)) {
    errores.push(`El rol debe ser uno de: ${ROLES.join(', ')}`);
  }
  if (typeof d.contrasena !== 'string' || d.contrasena.length < LARGO_MINIMO_CONTRASENA) {
    errores.push(`La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres`);
  }

  return { valido: errores.length === 0, errores };
}

function validarLogin(datos) {
  const errores = [];
  const d = datos || {};

  if (typeof d.correo !== 'string' || d.correo.trim() === '') errores.push('Falta el correo');
  if (typeof d.contrasena !== 'string' || d.contrasena === '') errores.push('Falta la contraseña');

  return { valido: errores.length === 0, errores };
}

function normalizarCorreo(correo) {
  return correo.trim().toLowerCase();
}

// Nunca se devuelve el hash de la contraseña al cliente.
function datosPublicos(usuario) {
  const { contrasenaHash, ...publicos } = usuario;
  return publicos;
}

module.exports = { validarRegistro, validarLogin, normalizarCorreo, datosPublicos };
