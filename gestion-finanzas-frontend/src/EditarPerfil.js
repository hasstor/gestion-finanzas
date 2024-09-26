import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditarPerfil({ token }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();  // Para redirigir después de guardar cambios

  useEffect(() => {
    // Obtener los datos del usuario actual para precargar el formulario
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:3000/mi-perfil', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        setNombre(data.nombre);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error al cargar los datos del usuario');
      }
    };

    fetchUsuario();
  }, [token]);

  // Manejo del formulario para actualizar el perfil
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    if (foto) {
      formData.append('foto_perfil', foto);  // Solo si hay nueva foto
    }

    try {
      const response = await fetch('http://localhost:3000/usuarios/editar-perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      setSuccess('Perfil actualizado exitosamente');
      setError('');

      // Redirigir al Dashboard después de actualizar
      setTimeout(() => {
        navigate('/dashboard');  // Redirige al Dashboard después de 2 segundos
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Perfil</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
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
          <label>Foto de perfil:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}  // Capturar la nueva imagen
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Guardar cambios</button>
      </form>
    </div>
  );
}

export default EditarPerfil;
