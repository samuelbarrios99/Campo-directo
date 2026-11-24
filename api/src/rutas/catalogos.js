// Las listas de opciones viven solo en config/constantes.js: el front las pide aquí.
const express = require('express');
const { CATEGORIAS, MUNICIPIOS, UNIDADES, ROLES } = require('../config/constantes');
const { responder } = require('../utils/respuestas');

const router = express.Router();

router.get('/', (req, res) => {
  responder(res, 200, {
    categorias: CATEGORIAS,
    municipios: MUNICIPIOS,
    unidades: UNIDADES,
    roles: ROLES
  });
});

module.exports = router;
