const express = require('express');
require('dotenv').config();
const { dbConntection } = require('./database/config');
const cors = require('cors');

//Servidor
const app = express();

//Base de datos

dbConntection();

//CORS

app.use(cors());

//Directorio Público

app.use(express.static('public'));

//Lectura y parseo del body

app.use(express.json());

//Importar rutas;

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});