import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Asegúrate de crear este archivo CSS

function Dashboard({ token, logout }) {
  const [transacciones, setTransacciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTransacciones = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/transacciones', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las transacciones');
      }

      const data = await response.json();
      setTransacciones(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar las transacciones');
    }
  }, [token]);

  const fetchUsuario = useCallback(async () => {
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
      setUsuario(data);
    } catch (error) {
      setError('Error al cargar los datos del usuario');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTransacciones();
      fetchUsuario();
    }
  }, [token, fetchTransacciones, fetchUsuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/transacciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo, cantidad: parseFloat(cantidad), categoria, descripcion, fecha }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la transacción');
      }

      const newTransaccion = await response.json();
      setTransacciones([...transacciones, newTransaccion]);
      setSuccess('Transacción agregada exitosamente');
      setError('');
      setCantidad('');
      setCategoria('');
      setDescripcion('');
      setFecha('');
      setTipo('ingreso');
    } catch (error) {
      setError('Error al agregar la transacción');
      setSuccess('');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <h2 className="text-center">Perfil</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {usuario && (
          <div className="text-center mb-4">
            <img src={`http://localhost:3000${usuario.foto_perfil}`} alt="Foto de perfil" className="rounded-circle mb-2" width="100" height="100" />
            <h4>{usuario.nombre}</h4>
            <p>{usuario.email}</p>
            <Link to="/editar-perfil" className="btn btn-warning w-100 mt-2">Editar perfil</Link>
          </div>
        )}
        <button onClick={logout} className="btn btn-danger w-100 mt-2">Cerrar Sesión</button>
      </div>
      <div className="transactions-section">
        <h2 className="text-center">Transacciones</h2>
        {transacciones.length > 0 ? (
          <ul className="list-group mb-4">
            {transacciones.map((transaccion) => (
              <li key={transaccion.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{transaccion.fecha}</strong> - {transaccion.categoria} ({transaccion.tipo})
                </div>
                <span className={`badge ${transaccion.tipo === 'ingreso' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                  ${transaccion.cantidad}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No hay transacciones disponibles</p>
        )}
        <h3 className="text-center">Agregar nueva transacción</h3>
        <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
          <div className="mb-3">
            <label>Tipo:</label>
            <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Cantidad:</label>
            <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Fecha:</label>
            <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Categoría:</label>
            <input type="text" className="form-control" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Descripción:</label>
            <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-success w-100">Agregar</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;