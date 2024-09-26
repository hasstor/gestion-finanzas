const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Configurar Multer para manejar archivos de imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generar un nombre único para la imagen
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));  // Servir imágenes estáticas desde 'uploads'

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'franco',
  database: 'finanzas_familiares'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, no hay token' });
  }
  try {
    const verified = jwt.verify(token, 'clave_secreta_jwt');  // Verificar el token
    req.user = verified;  // Asignar el usuario autenticado
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token no válido' });
  }
}

// Ruta para registrar un usuario con foto de perfil
app.post('/usuarios', upload.single('foto_perfil'), async (req, res) => {
  const { nombre, email, password } = req.body;
  const fotoPerfil = req.file ? `/uploads/${req.file.filename}` : null;  // Obtener la ruta de la imagen subida

  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el usuario en la base de datos
    const sql = 'INSERT INTO usuarios (nombre, email, password, verificado, foto_perfil) VALUES (?, ?, ?, FALSE, ?)';
    db.query(sql, [nombre, email, hashedPassword, fotoPerfil], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({ message: 'Usuario registrado', id: result.insertId, fotoPerfil });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Ruta para actualizar la foto de perfil del usuario
app.put('/usuarios/foto-perfil', authenticateToken, upload.single('foto_perfil'), (req, res) => {
  const userId = req.user.id;  // ID del usuario autenticado
  const fotoPerfil = `/uploads/${req.file.filename}`;  // Ruta de la imagen guardada

  const sql = 'UPDATE usuarios SET foto_perfil = ? WHERE id = ?';
  db.query(sql, [fotoPerfil, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la foto de perfil' });
    }
    res.json({ message: 'Foto de perfil actualizada', foto_perfil: fotoPerfil });
  });
});

// Ruta para obtener el perfil del usuario autenticado
app.get('/mi-perfil', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT nombre, email, foto_perfil FROM usuarios WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cargar los datos del usuario' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result[0]);
  });
});

// Ruta para obtener las transacciones del usuario autenticado
app.get('/transacciones', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = 'SELECT * FROM transacciones WHERE user_id = ? ORDER BY fecha DESC';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cargar las transacciones' });
    }

    if (result.length === 0) {
      return res.json([]);  // Devolver un array vacío si no hay transacciones
    }

    res.json(result);  // Devolver las transacciones en formato JSON
  });
});

// Ruta para agregar una nueva transacción
app.post('/transacciones', authenticateToken, (req, res) => {
  const { tipo, cantidad, categoria, descripcion, fecha } = req.body;
  const userId = req.user.id;

  // Validación de campos obligatorios
  if (!tipo || !cantidad || !categoria || !fecha) {
    return res.status(400).json({ message: 'Por favor complete todos los campos' });
  }

  const sql = 'INSERT INTO transacciones (user_id, tipo, cantidad, categoria, descripcion, fecha) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [userId, tipo, cantidad, categoria, descripcion, fecha], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar la transacción' });
    }

    res.json({ message: 'Transacción agregada exitosamente', id: result.insertId });
  });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result[0];

    if (!user.verificado) {
      return res.status(403).json({ message: 'Debes verificar tu email antes de iniciar sesión' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id }, 'clave_secreta_jwt', { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token });
  });
});

// Ruta para actualizar el perfil del usuario (nombre, email, foto de perfil)
app.put('/usuarios/editar-perfil', authenticateToken, upload.single('foto_perfil'), (req, res) => {
  const userId = req.user.id;  // Obtener el ID del usuario autenticado
  const { nombre, email } = req.body;  // Datos del perfil que se quieren actualizar
  const fotoPerfil = req.file ? `/uploads/${req.file.filename}` : null;  // Ruta de la imagen, si se subió una nueva

  // Actualizar el perfil con o sin nueva foto de perfil
  const sql = fotoPerfil
    ? 'UPDATE usuarios SET nombre = ?, email = ?, foto_perfil = ? WHERE id = ?'
    : 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';

  const params = fotoPerfil
    ? [nombre, email, fotoPerfil, userId]
    : [nombre, email, userId];

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el perfil' });
    }

    res.json({ message: 'Perfil actualizado exitosamente' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
