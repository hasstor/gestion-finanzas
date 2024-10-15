import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Login.css'; // Importa los estilos si los tienes en un archivo separado

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Guardar el token en localStorage y actualizar el estado
      sessionStorage.setItem('token', data.token); // Guardar el token en el almacenamiento de sesión
      setToken(data.token);
      setError(''); // Limpiar errores si el inicio de sesión es exitoso
    } else {
      setError(data.message); // Mostrar el mensaje de error si las credenciales son incorrectas
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form">
        <h2 className="mb-4 text-center">Iniciar sesión</h2>
        {error && <p className="text-danger">{error}</p>} {/* Mostrar error si lo hay */}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary w-100 mb-3">Iniciar sesión</button>
        </form>
        <p className="text-center">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link> {/* Link a la página de registro */}
        </p>
      </div>
    </div>
  );
}

export default Login;
