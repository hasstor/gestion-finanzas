import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css'; // Asegúrate de tener este archivo CSS para los estilos específicos del perfil

function Profile({ usuario, logout }) {
  if (!usuario) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="profile-container">
      <div className="text-center">
        <img
          src={`http://localhost:3000${usuario.foto_perfil}`}
          alt="Foto de perfil"
          className="profile-page-image mb-2"  // Usamos "profile-page-image" para aplicar el mismo estilo
        />
        <h4>{usuario.nombre}</h4>
        <p>{usuario.email}</p>
        <Link to="/editar-perfil" className="btn btn-edit w-100 mt-2">
          <FaEdit className="icon" /> Editar perfil
        </Link>
        {/* Botón de cerrar sesión */}
        <button onClick={logout} className="btn btn-logout w-100 mt-2">
          <FaSignOutAlt className="icon" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;
