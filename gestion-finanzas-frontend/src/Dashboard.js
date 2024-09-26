import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ token, logout }) {  
  const [transacciones, setTransacciones] = useState([]);
  const [usuario, setUsuario] = useState(null);  // Nuevo estado para almacenar datos del usuario
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nuevaFoto, setNuevaFoto] = useState(null);  // Estado para la nueva foto

  // Fetch de transacciones al cargar el componente
  useEffect(() => {
    const fetchTransacciones = async () => {
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
        if (Array.isArray(data)) {
          setTransacciones(data);  // Asegurarse de que data sea un array
        } else {
          setTransacciones([]);  // Si no es un array, lo inicializamos vacío
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error al cargar las transacciones');
      }
    };

    // Fetch de los datos del usuario al cargar el componente
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:3000/mi-perfil', {  // Ruta para obtener datos del perfil
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }

        const data = await response.json();
        setUsuario(data);  // Guardar los datos del usuario, incluida la foto de perfil
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error al cargar los datos del usuario');
      }
    };

    fetchTransacciones();
    fetchUsuario();
  }, [token]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/transacciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          cantidad: parseFloat(cantidad),
          categoria,
          descripcion,
          fecha
        }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la transacción');
      }

      const newTransaccion = await response.json();
      setTransacciones([...transacciones, newTransaccion]);  // Agregar la nueva transacción a la lista
      setSuccess('Transacción agregada exitosamente');
      setError('');

      // Limpiar el formulario después de enviar
      setCantidad('');
      setCategoria('');
      setDescripcion('');
      setFecha('');
      setTipo('ingreso');
    } catch (error) {
      console.error('Error al agregar la transacción:', error);
      setError('Error al agregar la transacción');
      setSuccess('');
    }
  };

  // Manejo del envío de la nueva foto de perfil
  const handleSubmitFoto = async (e) => {
    e.preventDefault();

    if (!nuevaFoto) {
      setError('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('foto_perfil', nuevaFoto);

    try {
      const response = await fetch('http://localhost:3000/usuarios/foto-perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la foto de perfil');
      }

      const data = await response.json();
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        foto_perfil: data.foto_perfil,
      }));
      setSuccess('Foto de perfil actualizada exitosamente');
      setError('');
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      setError('Error al actualizar la foto de perfil');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Mi Perfil</h2>

      {/* Mostrar mensaje de éxito o error */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Mostrar información del usuario */}
      {usuario && (
        <div className="text-center mb-4">
          <img 
            src={usuario.foto_perfil} 
            alt="Foto de perfil" 
            className="rounded-circle mb-2" 
            width="150" 
            height="150"
          />
          <h4>{usuario.nombre}</h4>
          <p>{usuario.email}</p>

          {/* Formulario para subir nueva foto de perfil */}
          <form onSubmit={handleSubmitFoto}>
            <div className="mb-3">
              <label>Nueva foto de perfil:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setNuevaFoto(e.target.files[0])}  // Obtener la imagen seleccionada
              />
            </div>
            <button type="submit" className="btn btn-primary">Actualizar foto de perfil</button>
          </form>
        </div>
      )}

      <h2 className="mb-4 text-center">Transacciones</h2>

      {/* Lista de transacciones */}
      <ul className="list-group mb-4">
        {transacciones.length > 0 ? (
          transacciones.map((transaccion) => (
            <li key={transaccion.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{transaccion.fecha}</strong> - {transaccion.categoria} ({transaccion.tipo})
              </div>
              <span className={`badge ${transaccion.tipo === 'ingreso' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                ${transaccion.cantidad}
              </span>
            </li>
          ))
        ) : (
          <p className="text-center">No hay transacciones disponibles</p>
        )}
      </ul>

      {/* Formulario para agregar transacciones */}
      <h3 className="mb-4 text-center">Agregar nueva transacción</h3>
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

      {/* Botón de Cerrar Sesión */}
      <div className="text-center mt-4">
        <button onClick={logout} className="btn btn-danger">Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Dashboard;
