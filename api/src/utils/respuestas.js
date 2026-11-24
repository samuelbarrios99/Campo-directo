// Un solo lugar donde se decide el formato de las respuestas.

function responder(res, codigo, datos) {
  res.status(codigo).json(datos);
}

function responderError(res, codigo, mensaje, detalles) {
  const cuerpo = { error: mensaje };
  if (detalles) cuerpo.detalles = detalles;
  res.status(codigo).json(cuerpo);
}

module.exports = { responder, responderError };
