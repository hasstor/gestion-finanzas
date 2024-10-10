import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import PrivateRoute from './PrivateRoute';  // Importar el componente de rutas privadas
import EditarPerfil from './EditarPerfil';  // Importamos el nuevo componente

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  // Función para guardar el token en localStorage
  const saveToken = (token) => {
    sessionStorage.setItem('token', token);
    setToken(token);
  };

  // Función para hacer logout y eliminar el token
  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login setToken={saveToken} />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute token={token}>
                <Dashboard token={token} logout={logout} />
              </PrivateRoute>
            }
          />

          {/* Ruta para editar perfil */}
          <Route
            path="/editar-perfil"
            element={
              <PrivateRoute token={token}>
                <EditarPerfil token={token} />
              </PrivateRoute>
            }
          />

          {/* Redirigir cualquier ruta desconocida al login si no está autenticado */}
          <Route
            path="*"
            element={
              !token ? (
                <Login setToken={saveToken} />
              ) : (
                <Dashboard token={token} logout={logout} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
