const express = require('express');
const cors = require('cors');
const registrar = require('./middleware/registrar');
const { noEncontrada, manejarErrores } = require('./middleware/manejarErrores');
const rutasProductos = require('./rutas/productos');
const rutasUsuarios = require('./rutas/usuarios');
const rutasCatalogos = require('./rutas/catalogos');

// CORS nunca queda abierto: se exige declarar qué front puede llamar a la API.
function crearApp(origenPermitido) {
  if (!origenPermitido) {
    throw new Error('Falta FRONT_URL: define qué front puede llamar a la API (ver .env.example)');
  }

  const app = express();
  app.use(cors({ origin: origenPermitido }));
  app.use(express.json());
  app.use(registrar);

  app.get('/salud', (req, res) => res.json({ estado: 'ok' }));
  app.use('/productos', rutasProductos);
  app.use('/usuarios', rutasUsuarios);
  app.use('/catalogos', rutasCatalogos);

  app.use(noEncontrada);
  app.use(manejarErrores);
  return app;
}

module.exports = { crearApp };
