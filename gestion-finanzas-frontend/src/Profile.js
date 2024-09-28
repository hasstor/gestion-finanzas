// src/Profile.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

function Profile({ usuario }) {
  if (!usuario) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="profile-container">
      <div className="text-center">
        <img
          src={`http://localhost:3000${usuario.foto_perfil}`}
          alt="Foto de perfil"
          className="profile-image mb-2"
        />
        <h4>{usuario.nombre}</h4>
        <p>{usuario.email}</p>
        <Link to="/editar-perfil" className="btn btn-edit w-100 mt-2">
          <FaEdit className="icon" /> Editar perfil
        </Link>
      </div>
    </div>
  );
}

export default Profile;
