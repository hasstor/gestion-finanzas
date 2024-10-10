// src/Inversiones.js
import React, { useState } from 'react';

function Inversiones({ inversiones, token }) {
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitInversion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/inversiones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          cantidad: parseFloat(cantidad),
          fecha,
          descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la inversión');
      }

      const newInversion = await response.json();
      setSuccess('Inversión agregada exitosamente');
      setError('');
      setCantidad('');
      setTipo('');
      setFecha('');
      setDescripcion('');
      // Actualiza el estado de inversiones si lo necesitas
      inversiones.push(newInversion);
    } catch (error) {
      console.error('Error al agregar la inversión:', error);
      setError('Error al agregar la inversión');
      setSuccess('');
    }
  };

  return (
    <div className="inversiones-container">
      <h2 className="text-center">Inversiones</h2>
      {inversiones.length > 0 ? (
        <ul className="list-group mb-4">
          {inversiones.map((inversion) => (
            <li key={inversion.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{inversion.fecha}</strong> - {inversion.tipo} (${inversion.cantidad})
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No hay inversiones disponibles</p>
      )}

      {/* Formulario para agregar nueva inversión */}
      <h3 className="text-center">Agregar nueva inversión</h3>
      <form onSubmit={handleSubmitInversion} className="col-md-6 mx-auto">
        <div className="mb-3">
          <label>Tipo de Inversión:</label>
          <input
            type="text"
            className="form-control"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
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
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
}

export default Inversiones;
