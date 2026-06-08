import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isRegister = mode === "register";
  const API_URL = "http://localhost:3000/api/auth";

  // Manejador único para todos los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Resetea el formulario al cambiar de pestaña (Login / Registro)
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFormData({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      if (isRegister) {
        // Validación de contraseñas idénticas
        if (formData.password !== formData.confirmPassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
          }),
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Error en el registro");

        alert("Usuario registrado correctamente");
        handleModeChange("login"); // Pasa a login de manera limpia
        return;
      }

      // Flujo de Inicio de Sesión (Login)
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      console.log("USER:", data.data?.user);
      console.log("ROLE:", data.data?.user?.roles);
      
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
      }
      
      if (data.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.data.user)
        );
      }
      
      // Obtener nombre del rol
      const roleName =
        data.data?.user?.roles?.name ||
        data.data?.user?.roleName ||
        "";


      
      // Redirección según rol
      if (roleName.toUpperCase() === "ADMIN") {
        navigate("/Dashboard");
      } else {
        navigate("/Partidos");
      }

      alert(`Bienvenido ${data.data?.user?.username || formData.email}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🏆</span>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none mt-1">
                FIFA World Cup 2026
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                !isRegister
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-900/30"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("register")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                isRegister
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-900/30"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              Registro
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main
        className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4 py-14"
        style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
      >
        <section className="relative w-full max-w-5xl overflow-hidden">
          {/* Efectos de luces de fondo (Glows) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-green-900/15 blur-[120px] rounded-full" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-900/10">
            
            {/* Panel lateral decorativo (solo visible en escritorio) */}
            <div className="hidden lg:flex flex-col justify-between p-10 border-r border-gray-800">
              <div>
                <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-400/5 rounded-full px-4 py-1.5 mb-6">
                  <span className="text-yellow-400 text-sm">⚽</span>
                  <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em]">
                    MundialBet 2026
                  </span>
                </div>

                <h2 className="text-5xl font-black leading-none tracking-tight mb-4">
                  <span className="block text-white">APUESTA AL</span>
                  <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                    CAMPEÓN
                  </span>
                  <span className="block text-3xl text-white/60 mt-1">
                    del Mundo
                  </span>
                </h2>

                <p className="text-gray-400 text-base leading-relaxed max-w-md">
                  Entra a tu cuenta para revisar tus apuestas, cuotas en vivo y mercados especiales del Mundial.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-10">
                <div className="bg-black/50 border border-gray-800 rounded-xl p-4 text-center">
                  <p className="text-yellow-400 text-2xl font-black">64</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Partidos</p>
                </div>
                <div className="bg-black/50 border border-gray-800 rounded-xl p-4 text-center">
                  <p className="text-yellow-400 text-2xl font-black">$300</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Bono</p>
                </div>
              </div>
            </div>

            {/* Panel del Formulario */}
            <div className="p-6 sm:p-10">
              <div className="mb-8 text-center lg:text-left">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-[0.25em] mb-2">
                  {isRegister ? "Crear cuenta" : "Acceso de usuario"}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">
                  {isRegister ? "Registrarse" : "Iniciar sesión"}
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  {isRegister
                    ? "Crea tu cuenta y recibe tu bono de bienvenida."
                    : "Ingresa para continuar apostando al Mundial."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campos exclusivos de registro */}
                {isRegister && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                        className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Apellido"
                        required
                        className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                      />
                    </div>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nombre de usuario"
                      required
                      className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </>
                )}

                {/* Campos compartidos */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    required
                    className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                  />
                </div>

                {/* Confirmar Contraseña (solo registro) */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Recordarme (solo login) */}
                {!isRegister && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-500 focus:ring-offset-black"
                      />
                      Recordarme
                    </label>

                    <button
                      type="button"
                      className="text-green-400 hover:text-green-300 font-bold transition-colors"
                    >
                      Olvidé mi contraseña
                    </button>
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:scale-100 disabled:cursor-not-allowed text-black font-black text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 uppercase tracking-wide shadow-xl shadow-yellow-900/30"
                >
                  {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange(isRegister ? "login" : "register")}
                  className="text-yellow-400 hover:text-yellow-300 font-black uppercase tracking-wide transition-colors"
                >
                  {isRegister ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 bg-black px-4 py-6 text-center">
        <p className="text-gray-700 text-xs">
          © 2026 MundialBet. +18 · Juega con responsabilidad.
        </p>
      </footer>
    </>
  );
}