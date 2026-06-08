import { useState } from "react";

export default function Login() {
  const [mode, setMode] = useState("login");
  const isRegister = mode === "register";

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🏆</span>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none">
                FIFA World Cup 2026
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
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
              onClick={() => setMode("register")}
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

      <main
        className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4 py-14"
        style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
      >
        <section className="relative w-full max-w-5xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-green-900/15 blur-[120px] rounded-full" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-900/10">
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
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                    Partidos
                  </p>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-4 text-center">
                  <p className="text-yellow-400 text-2xl font-black">$300</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                    Bono
                  </p>
                </div>
              </div>
            </div>

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

              <form className="space-y-5">
                {isRegister && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none transition-colors duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none transition-colors duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none transition-colors duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10"
                  />
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none transition-colors duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10"
                    />
                  </div>
                )}

                {!isRegister && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-500">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-500"
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

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 uppercase tracking-wide shadow-xl shadow-yellow-900/30"
                >
                  {isRegister ? "Crear cuenta" : "Entrar"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(isRegister ? "login" : "register")}
                  className="text-yellow-400 hover:text-yellow-300 font-black uppercase tracking-wide transition-colors"
                >
                  {isRegister ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-900 bg-black px-4 py-6 text-center">
        <p className="text-gray-700 text-xs">
          © 2026 MundialBet. +18 · Juega con responsabilidad.
        </p>
      </footer>
    </>
  );
}