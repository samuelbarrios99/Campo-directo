// Se ejecuta ANTES de todas las rutas: deja constancia de cada petición.
function registrar(req, res, siguiente) {
  console.log(`${req.method} ${req.url}`);
  siguiente();
}

module.exports = registrar;
