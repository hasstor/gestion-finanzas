// src/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, Routes } from 'react-router-dom';
import { FaBars, FaUser, FaClipboardList, FaChartLine, FaHome} from 'react-icons/fa';
import './Dashboard.css';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Inversiones from './Inversiones';

function Dashboard({ token, logout }) {
  const [transacciones, setTransacciones] = useState([]);
  const [inversiones, setInversiones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [gastosMes, setGastosMes] = useState([]);
  const [ingresosMes, setIngresosMes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch de transacciones
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

  // Fetch de inversiones
  const fetchInversiones = useCallback(async () => {
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
  }, [token]);

  // Fetch del usuario
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
      fetchInversiones();
    }
  }, [token, fetchTransacciones, fetchUsuario, fetchInversiones]);

  // Manejo de agregar transacción
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

    // Función para obtener los gastos del mes
  const fetchGastosMes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/transacciones/gastos-mes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los gastos del mes');
      }
      const data = await response.json();
      setGastosMes(data);
    } catch (error) {
      setError('Error al cargar los gastos del mes');
    }
  }, [token]);

  // Función para obtener los ingresos del mes
  const fetchIngresosMes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/transacciones/ingresos-mes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los ingresos del mes');
      }
      const data = await response.json();
      setIngresosMes(data);
    } catch (error) {
      setError('Error al cargar los ingresos del mes');
    }
  }, [token]);

  // Usar useEffect para cargar las transacciones del mes
  useEffect(() => {
    if (token) {
      fetchGastosMes();
      fetchIngresosMes();
    }
  }, [token, fetchGastosMes, fetchIngresosMes]);

  return (
    <div className="dashboard-container">
      {/* Barra lateral del menú */}
      <div id="sidebar" className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
         {/* Botón hamburguesa siempre visible y fijo */}
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="sidebar"
        >
          <FaBars />
        </button>

        {/* Enlaces de navegación en la barra lateral */}
        <nav className="nav flex-column mt-3">
          <Link to="/" className="nav-link">
            <FaHome /> {isMenuOpen && "Inicio"}
          </Link>
          <Link to="/perfil" className="nav-link">
            <FaUser /> {isMenuOpen && "Perfil"}
          </Link>
          <Link to="/transacciones" className="nav-link">
            <FaClipboardList /> {isMenuOpen && "Transacciones"}
          </Link>
          <Link to="/inversiones" className="nav-link">
            <FaChartLine /> {isMenuOpen && "Inversiones"}
          </Link>
        </nav>

        {/* Imagen de perfil y nombre siempre visibles al final */}
        <div className="sidebar-user-info">
                <img
                  src={`http://localhost:3000${usuario?.foto_perfil}`}
                  alt="Foto de perfil"
                  className="profile-image"
                />
                {isMenuOpen && <p>{usuario?.nombre}</p>}
              </div>
            </div>

      {/* Sección de contenido principal */}
      <div className={`content-section ${isMenuOpen ? 'overlay' : ''}`}>
        <Routes>
          {/* Página principal que muestra ingresos y gastos del mes */}
          <Route
            path="/"
            element={
              <div>
                <h2 className="text-center">Resumen del mes</h2>

                {/* Ingresos del mes */}
                <h3 className="text-center">Ingresos del mes</h3>
                {ingresosMes.length > 0 ? (
                  <ul className="list-group mb-4">
                    {ingresosMes.map((ingreso) => (
                      <li key={ingreso.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{ingreso.fecha}</strong> - {ingreso.categoria} (${ingreso.cantidad})
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center">No hay ingresos disponibles este mes</p>
                )}

                {/* Gastos del mes */}
                <h3 className="text-center">Gastos del mes</h3>
                {gastosMes.length > 0 ? (
                  <ul className="list-group mb-4">
                    {gastosMes.map((gasto) => (
                      <li key={gasto.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{gasto.fecha}</strong> - {gasto.categoria} (${gasto.cantidad})
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center">No hay gastos disponibles este mes</p>
                )}
              </div>
            }
          />
            {/* Página de Perfil */}
            <Route path="/perfil" element={<Profile usuario={usuario} logout={logout} />} />

            {/* Página de Edición de Perfil */}
            <Route path="/editar-perfil" element={<EditProfile usuario={usuario} />} />

            {/* Página de Transacciones */}
            <Route
            path="/transacciones"
            element={
              <div>
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

                {/* Formulario para agregar nueva transacción */}
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
                    <label>Categoría:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
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
                  <button type="submit" className="btn btn-success w-100">Agregar</button>
                </form>
              </div>
            }
          />

          {/* Página de Inversiones */}
          <Route
            path="/inversiones"
            element={<Inversiones inversiones={inversiones} token={token}/>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
