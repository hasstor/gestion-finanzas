import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, Routes } from 'react-router-dom';
import { FaBars, FaUser, FaClipboardList, FaChartLine} from 'react-icons/fa'; // Añadido FaChartLine para inversiones
import './Dashboard.css';
import Profile from './Profile'; 
import EditProfile from './EditProfile'; 
import Inversiones from './Inversiones';

function Dashboard({ token }) {
  const [transacciones, setTransacciones] = useState([]);
  const [inversiones, setInversiones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
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
      fetchInversiones(); // Fetch de las inversiones
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

  return (
    <div className="dashboard-container">
      {/* Barra lateral del menú */}
      <div id="sidebar" className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        {/* Botón hamburguesa en el menú */}
        <button
          className="hamburger-btn nav-link"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="sidebar"
        >
          <FaBars />
        </button>

        {/* Enlaces de navegación en la barra lateral */}
        <nav className="nav flex-column mt-3">
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

        {/* Mostrar información del usuario en la parte inferior solo si está expandido */}
        {isMenuOpen && usuario && (
          <div className="sidebar-user-info">
            <img
              src={`http://localhost:3000${usuario.foto_perfil}`}
              alt="Foto de perfil"
              className="profile-image mb-2"
            />
            <p>{usuario.nombre}</p>
          </div>
        )}
      </div>

      {/* Sección de contenido que cambia según la ruta */}
      <div className={`content-section ${isMenuOpen ? 'overlay' : ''}`}>
        <Routes>
          {/* Página de Perfil */}
          <Route
            path="/perfil"
            element={<Profile usuario={usuario} />}
          />

          {/* Página de Edición de Perfil */}
          <Route
            path="/editar-perfil"
            element={<EditProfile usuario={usuario} />}
          />

          {/* Página de Transacciones */}
          <Route
            path="/transacciones"
            element={
              <>
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
              </>
            }
          />

          {/* Página de Inversiones */}
          <Route
            path="/inversiones"
            element={
              <>
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
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;