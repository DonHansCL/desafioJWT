const express = require('express');
const cors = require('cors');
const usuariosRoutes = require('./routes/usuariosRoutes');
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza con el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
app.use(express.json());
app.use(loggerMiddleware);

// Rutas
app.use('/', usuariosRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

module.exports = app;