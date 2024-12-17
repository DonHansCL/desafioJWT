const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registro de nuevos usuarios
const registerUsuario = async (req, res) => {
    try {
      const { email, password, rol, lenguage } = req.body;
  
      // Verificar si el usuario ya existe
      const userCheck = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: 'El usuario ya existe.' });
      }
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insertar el nuevo usuario
      const insertQuery = `
        INSERT INTO usuarios (email, password, rol, lenguage)
        VALUES ($1, $2, $3, $4) RETURNING id, email, rol, lenguage
      `;
      const values = [email, hashedPassword, rol, lenguage];
      const { rows } = await pool.query(insertQuery, values);
  
      res.status(201).json({ user: rows[0] });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  };
  
  // Login de usuarios
  const loginUsuario = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Verificar si el usuario existe
      const userQuery = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      if (userQuery.rows.length === 0) {
        return res.status(400).json({ message: 'Credenciales inválidas.' });
      }
  
      const user = userQuery.rows[0];
  
      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas.' });
      }
  
      // Generar JWT
      const payload = { email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error al autenticar el usuario.' });
    }
  };

  // Obtener datos de usuario autenticado
  const getUsuario = async (req, res) => {
    try {
      const { email } = req.user;
      const query = 'SELECT id, email, rol, lenguage FROM usuarios WHERE email = $1';
      const { rows } = await pool.query(query, [email]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      res.json(rows); // Enviar un array en lugar de un objeto
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los datos del usuario.' });
    }
  };
  
  module.exports = { registerUsuario, loginUsuario, getUsuario };