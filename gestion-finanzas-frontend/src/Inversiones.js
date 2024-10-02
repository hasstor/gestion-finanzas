// Inversiones.js
import React, { useState, useEffect } from 'react';

function Inversiones({ token }) {
  const [inversiones, setInversiones] = useState([]);
  const [tipoInversion, setTipoInversion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función para obtener las inversiones del usuario
  const fetchInversiones = async () => {
    try {
      const response = await fetch('http://localhost:3000/inversiones', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las inversiones');
      }

      const data = await response.json();
      setInversiones(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar las inversiones');
    }
  };

  // Llamar a la función de fetch al cargar el componente
  useEffect(() => {
    if (token) {
      fetchInversiones();
    }
  }, [token]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/inversiones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo: tipoInversion, monto: parseFloat(monto), fecha, descripcion }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la inversión');
      }

      const newInversion = await response.json();
      setInversiones([...inversiones, newInversion]);
      setSuccess('Inversión agregada exitosamente');
      setError('');
      setTipoInversion('');
      setMonto('');
      setFecha('');
      setDescripcion('');
    } catch (error) {
      setError('Error al agregar la inversión');
      setSuccess('');
    }
  };

  return (
    <div className="inversiones-container">
      <h2 className="text-center">Inversiones</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      {inversiones.length > 0 ? (
        <ul className="list-group mb-4">
          {inversiones.map((inversion) => (
            <li key={inversion.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{inversion.fecha}</strong> - {inversion.tipo} - ${inversion.monto}
              </div>
              <span>{inversion.descripcion}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No hay inversiones disponibles</p>
      )}

      <h3 className="text-center">Agregar nueva inversión</h3>
      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
        <div className="mb-3">
          <label>Tipo de Inversión:</label>
          <input
            type="text"
            className="form-control"
            value={tipoInversion}
            onChange={(e) => setTipoInversion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Monto:</label>
          <input
            type="number"
            className="form-control"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Fecha:</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Agregar Inversión</button>
      </form>
    </div>
  );
}

export default Inversiones;
