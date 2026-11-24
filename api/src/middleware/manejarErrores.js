const { responderError } = require('../utils/respuestas');

function noEncontrada(req, res) {
  responderError(res, 404, `La ruta ${req.method} ${req.url} no existe`);
}

// Express reconoce un manejador de errores por sus cuatro parámetros.
function manejarErrores(error, req, res, siguiente) {
  if (error.type === 'entity.parse.failed') {
    return responderError(res, 400, 'El cuerpo de la petición no es un JSON válido');
  }
  console.error(error);
  responderError(res, 500, 'Error interno del servidor');
}

module.exports = { noEncontrada, manejarErrores };
