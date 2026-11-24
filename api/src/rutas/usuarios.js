const express = require('express');
const repositorio = require('../datos/repositorio-usuarios');
const {
  validarRegistro, validarLogin, normalizarCorreo, datosPublicos
} = require('../logica/reglas-usuarios');
const { hashearContrasena, verificarContrasena } = require('../logica/contrasenas');
const { responder, responderError } = require('../utils/respuestas');
const envolver = require('../utils/envolver');

const router = express.Router();

router.post('/registro', envolver(async (req, res) => {
  const { valido, errores } = validarRegistro(req.body);
  if (!valido) return responderError(res, 400, 'Datos de registro inválidos', errores);

  const correo = normalizarCorreo(req.body.correo);
  if (await repositorio.buscarPorCorreo(correo)) {
    return responderError(res, 409, 'Ya existe una cuenta con este correo');
  }

  const usuario = await repositorio.crear({
    nombre: req.body.nombre.trim(),
    correo,
    telefono: req.body.telefono.trim(),
    rol: req.body.rol,
    contrasenaHash: await hashearContrasena(req.body.contrasena)
  });

  responder(res, 201, datosPublicos(usuario));
}));

// Mismo mensaje si falla el correo o la contraseña: no se le dice al atacante cuál fue.
router.post('/login', envolver(async (req, res) => {
  const { valido, errores } = validarLogin(req.body);
  if (!valido) return responderError(res, 400, 'Datos de inicio de sesión inválidos', errores);

  const usuario = await repositorio.buscarPorCorreo(normalizarCorreo(req.body.correo));
  const coincide = usuario && await verificarContrasena(req.body.contrasena, usuario.contrasenaHash);
  if (!coincide) return responderError(res, 401, 'Correo o contraseña incorrectos');

  responder(res, 200, datosPublicos(usuario));
}));

module.exports = router;
