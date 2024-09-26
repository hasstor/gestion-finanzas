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
    cb(null, Date.now() + path.extname(file.originalname));  // Generar un nombre único
  },
});

const upload = multer({ storage });

// Ruta para actualizar la foto de perfil del usuario
app.put('/usuarios/foto-perfil', upload.single('foto_perfil'), (req, res) => {
  const token = req.header('Authorization').split(' ')[1];
  const decoded = jwt.verify(token, 'clave_secreta_jwt');  // Usar tu clave secreta JWT
  const userId = decoded.id;  // ID del usuario autenticado
  const fotoPerfil = `/uploads/${req.file.filename}`;  // Ruta de la imagen guardada

  const sql = 'UPDATE usuarios SET foto_perfil = ? WHERE id = ?';
  db.query(sql, [fotoPerfil, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar la foto de perfil' });
    }
    res.json({ message: 'Foto de perfil actualizada', foto_perfil: fotoPerfil });
  });
});

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

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe en la base de datos
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result[0];

    // Verificar si el usuario ha confirmado su correo
    if (!user.verificado) {
      return res.status(403).json({ message: 'Debes verificar tu email antes de iniciar sesión' });
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un token JWT con el ID del usuario
    const token = jwt.sign({ id: user.id }, 'clave_secreta_jwt', { expiresIn: '1h' });

    // Responder con el token y un mensaje de éxito
    res.json({ message: 'Login exitoso', token });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
