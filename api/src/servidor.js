require('dotenv').config();
const { crearApp } = require('./app');

const PUERTO = process.env.PORT || 3000;
const app = crearApp(process.env.FRONT_URL);

app.listen(PUERTO, () => console.log('API de CampoDirecto escuchando en el puerto ' + PUERTO));
