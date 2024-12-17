const express = require('express');
const { registerUsuario, loginUsuario, getUsuario } = require('../controllers/usuariosController');
const credentialMiddleware = require('../middlewares/credentialMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/usuarios', credentialMiddleware, registerUsuario);

// Ruta de login
router.post('/login', credentialMiddleware, loginUsuario);

// Ruta para obtener datos del usuario autenticado
router.get('/usuarios', authMiddleware, getUsuario);

module.exports = router;