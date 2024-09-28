// src/EditProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile({ usuario }) {
  const [nombre, setNombre] = useState(usuario ? usuario.nombre : '');
  const [email, setEmail] = useState(usuario ? usuario.email : '');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();

    // Crear el FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    if (fotoPerfil) {
      formData.append('foto_perfil', fotoPerfil);
    }

    try {
      const response = await fetch('http://localhost:3000/usuarios/editar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${usuario.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      alert('Perfil actualizado con éxito');
      navigate('/perfil');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  const handleCancel = () => {
    navigate('/perfil');
  };

  return (
    <div className="edit-profile-container">
      <h2 className="text-center">Editar Perfil</h2>
      <form onSubmit={handleSave} className="col-md-6 mx-auto">
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
            onChange={(e) => setFotoPerfil(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Guardar Cambios</button>
        <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditProfile;
