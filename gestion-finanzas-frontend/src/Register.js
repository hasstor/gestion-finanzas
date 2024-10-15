import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Importa los estilos si los tienes en un archivo separado

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null); // Nuevo estado para la imagen
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Usar useNavigate para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Usar FormData para enviar datos incluyendo la imagen
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('password', password);
    if (fotoPerfil) {
      formData.append('foto_perfil', fotoPerfil);  // Añadir la imagen si existe
    }

    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      body: formData,  // Enviar el FormData en lugar de JSON
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      setError('');
    } else {
      setError(data.message);
      setMessage('');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form">
        <h2 className="mb-4 text-center">Registro</h2>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Input para la foto de perfil */}
          <div className="mb-3">
            <label>Foto de perfil:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setFotoPerfil(e.target.files[0])}  // Obtener el archivo seleccionado
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
        </form>

        <p className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
