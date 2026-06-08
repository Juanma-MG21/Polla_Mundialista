import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/auth';

function roleBadge(roleName) {
  const name = (roleName || 'USER').toUpperCase();
  if (name === 'ADMIN') {
    return (
      <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
        Admin
      </span>
    );
  }
  if (name === 'MODERATOR') {
    return (
      <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
        Moderador
      </span>
    );
  }
  return (
    <span className="bg-gray-800 border border-gray-700 text-gray-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
      Usuario
    </span>
  );
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [cargandoModal, setCargandoModal] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Debes iniciar sesión para acceder al panel de usuarios');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const [usuariosRes, rolesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/usuarios`, { headers }),
        fetch(`${API_BASE_URL}/roles`, { headers }),
      ]);

      const usuariosData = await usuariosRes.json();
      const rolesData = await rolesRes.json();

      if (usuariosData.ok) {
        setUsuarios(usuariosData.usuarios || []);
      } else {
        setError(usuariosData.mensaje || 'No se pudieron cargar los usuarios');
      }

      if (rolesData.ok) {
        setRoles(rolesData.roles || []);
      }
    } catch (err) {
      setError('Error al obtener los usuarios del servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombre(usuario.first_name || '');
    setApellido(usuario.last_name || '');
    setEmail(usuario.email || '');
    setRol(String(usuario.role_id));
    setModalAbierto(true);
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre || !apellido || !email || !rol) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    setCargandoModal(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioSeleccionado.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: nombre,
          last_name: apellido,
          email,
          role_id: rol,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setUsuarios(usuarios.map((u) =>
          u.user_id === usuarioSeleccionado.user_id ? data.usuario : u
        ));
        setModalAbierto(false);
      } else {
        setError(data.mensaje);
      }
    } catch (err) {
      setError('Error al actualizar las credenciales del usuario');
      console.error(err);
    } finally {
      setCargandoModal(false);
    }
  };

  const handleBorrar = async (id) => {
    if (window.confirm('¿Seguro deseas eliminar de forma permanente a este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.ok) {
          setUsuarios(usuarios.filter((u) => u.user_id !== id));
        } else {
          setError(data.mensaje);
        }
      } catch (err) {
        setError('Error al eliminar al usuario de la base de datos');
        console.error(err);
      }
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-4 border-t-yellow-400 border-gray-800 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-xs font-black uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Cargando Panel de Control...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080808] text-white"
      style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
    >
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🏆</span>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none mt-1">
                Panel Administrativo
              </span>
            </h1>
          </div>
          <div>
            <Link
              to="/Dashboard"
              className="border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-black px-4 py-2 rounded-xl transition-all uppercase tracking-wide"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-900/5 blur-[120px] rounded-full" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-yellow-400/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative space-y-6">
          <div className="border-b border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Usuarios Registrados</h2>
              <p className="text-gray-500 text-xs">Gestión global de credenciales, roles y accesos al sistema</p>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg">
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.length === 0 ? (
              <div className="col-span-full bg-gray-900/20 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
                No hay cuentas de usuarios registradas en la plataforma.
              </div>
            ) : (
              usuarios.map((usuario) => (
                <div
                  className="bg-gradient-to-br from-gray-900/50 to-black/80 border border-gray-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-gray-700/60"
                  key={usuario.user_id}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-gray-800/60 pb-2">
                      <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">ID: #{usuario.user_id}</span>
                      {roleBadge(usuario.roles?.name)}
                    </div>

                    <div className="pt-1">
                      <p className="text-white font-bold text-lg leading-tight uppercase">
                        {usuario.first_name || usuario.username} {usuario.last_name || ''}
                      </p>
                      <p className="text-gray-400 text-xs truncate mt-0.5">{usuario.email}</p>
                      <p className="text-gray-600 text-[10px] truncate mt-0.5">@{usuario.username}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 border-t border-gray-800/40 pt-3">
                    <button
                      onClick={() => handleEditar(usuario)}
                      className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-black text-xs uppercase py-2 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleBorrar(usuario.user_id)}
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-black text-xs uppercase px-3 py-2 rounded-lg transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="bg-[#0c0c0c] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-xl font-black uppercase tracking-wide text-white">Editar Cuenta</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-500 hover:text-white text-2xl font-light transition-colors leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleGuardarCambios} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Privilegios / Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-gray-700 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%239ca3af\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat' }}
                >
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id} className="bg-[#0c0c0c]">
                      {r.description || r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 bg-transparent hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white font-black text-xs uppercase py-2.5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoModal}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-50"
                >
                  {cargandoModal ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
