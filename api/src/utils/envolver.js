// Toda ruta async pasa por aquí: si algo falla, el error llega al manejador
// central en vez de perderse en silencio. Así no se repite try/catch en cada ruta.
function envolver(manejador) {
  return (req, res, next) => {
    Promise.resolve(manejador(req, res, next)).catch(next);
  };
}

module.exports = envolver;
