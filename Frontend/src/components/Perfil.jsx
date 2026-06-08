import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importación añadida para evitar errores de compilación

export default function Perfil() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "won" | "lost" | "pending"
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    balance: 0,
  });
  const [bets, setBets] = useState([]);

  const API_BASE_URL = "http://localhost:3000/api";

  // Efecto para cargar los datos del perfil y el historial al montar el componente
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No se encontró ningún token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Petición paralela para optimizar tiempos de respuesta de la API
        const [profileRes, betsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/bets/history`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }),
        ]);

        // 2. Procesamiento de la respuesta de perfil
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          // Adaptado al estándar de respuesta de tu backend ({ success: true, data: {...} })
          if (profileData.data) {
            setUser({
              username: profileData.data.username || "Usuario",
              email: profileData.data.email || "",
              first_name: profileData.data.first_name || "",
              last_name: profileData.data.last_name || "",
              balance: profileData.data.balance ?? 0,
            });
          }
        } else {
          console.error("Error al obtener los datos del perfil");
        }

        // 3. Procesamiento de la respuesta del historial de apuestas
        if (betsRes.ok) {
          const betsData = await betsRes.json();
          if (betsData.data && Array.isArray(betsData.data)) {
            setBets(betsData.data);
          }
        } else {
          console.error("Error al obtener el historial de apuestas");
        }

      } catch (error) {
        console.error("Error de conexión con el servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Cálculo dinámico de estadísticas basado en el estado real proveniente de la API
  const totalBets = bets.length;
  const wonBets = bets.filter((b) => b.status === "WON").length;
  const lostBets = bets.filter((b) => b.status === "LOST").length;
  const pendingBets = bets.filter((b) => b.status === "PENDING").length;
  const totalInverted = bets.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Filtrado de apuestas según la pestaña seleccionada
  const filteredBets = bets.filter((bet) => {
    if (activeTab === "all") return true;
    return bet.status === activeTab.toUpperCase();
  });

  // Helper estético para las etiquetas de estado de la apuesta
  const getStatusBadge = (status) => {
    switch (status) {
      case "WON":
        return (
          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
            Ganada
          </span>
        );
      case "LOST":
        return (
          <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
            Perdida
          </span>
        );
      default:
        return (
          <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
            Pendiente
          </span>
        );
    }
  };

  return (
    <>
      {/* HEADER DE MUNDIALBET */}
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

          <div className="flex items-center gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-1.5 text-right hidden sm:block">
              <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Mi Saldo</span>
              <span className="text-green-400 font-black text-sm">
                ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <Link
              to="/Partidos"
              className="border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-black px-3 py-2 rounded-lg transition-all uppercase tracking-wide"
            >
              Partidos
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main
        className="min-h-screen bg-[#080808] text-white px-4 py-10"
        style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto relative">
          {/* Luces decorativas de fondo (Glows) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-10 w-80 h-80 bg-green-900/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-400/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative space-y-8">
            {/* ENCABEZADO DE PERFIL Y BIENVENIDA */}
            <section className="bg-gradient-to-r from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
              <div>
                <div className="inline-flex items-center gap-1.5 border border-yellow-500/20 bg-yellow-400/5 rounded-full px-3 py-1 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Panel de Usuario</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase leading-none tracking-tight">
                  Hola,{" "}
                  <span className="text-yellow-400">
                    {loading ? "Cargando..." : user.username}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {user.first_name && user.last_name ? `${user.first_name} ${user.last_name} · ` : ""}Miembro de la comunidad
                </p>
              </div>

              <div className="w-full sm:w-auto bg-black/40 border border-gray-800/80 rounded-xl p-4 flex justify-between sm:gap-8 items-center">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Correo Electrónico</p>
                  <p className="text-gray-300 text-sm font-semibold">
                    {loading ? "..." : user.email || "Sin correo"}
                  </p>
                </div>
              </div>
            </section>

            {/* PANEL DE ESTADÍSTICAS DEL HISTORIAL */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Totales</p>
                <p className="text-white text-3xl font-black">{loading ? "..." : totalBets}</p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-center border-b-2 border-b-green-500/30">
                <p className="text-green-500 text-[10px] uppercase tracking-widest font-bold mb-1">Ganadas</p>
                <p className="text-green-400 text-3xl font-black">{loading ? "..." : wonBets}</p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-center border-b-2 border-b-red-500/30">
                <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold mb-1">Perdidas</p>
                <p className="text-red-400 text-3xl font-black">{loading ? "..." : lostBets}</p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 text-center border-b-2 border-b-yellow-500/30">
                <p className="text-yellow-500 text-[10px] uppercase tracking-widest font-bold mb-1">Pendientes</p>
                <p className="text-yellow-400 text-3xl font-black">{loading ? "..." : pendingBets}</p>
              </div>
              <div className="bg-gradient-to-b from-gray-900/60 to-black border border-gray-800 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                <p className="text-yellow-400 text-[10px] uppercase tracking-widest font-bold mb-1">Total Invertido</p>
                <p className="text-yellow-400 text-3xl font-black">${loading ? "..." : totalInverted}</p>
              </div>
            </section>

            {/* SECCIÓN DEL HISTORIAL DE APUESTAS */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-wide">Historial de Apuestas</h3>
                  <p className="text-gray-500 text-xs">Consulta todas las operaciones ejecutadas en tu cuenta</p>
                </div>

                {/* Filtros por pestañas */}
                <div className="flex items-center gap-1.5 bg-gray-900/80 border border-gray-800 rounded-xl p-1 overflow-x-auto">
                  {[
                    { id: "all", label: "Todas" },
                    { id: "won", label: "Ganadas" },
                    { id: "lost", label: "Perdidas" },
                    { id: "pending", label: "Pendientes" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-yellow-400 text-black shadow-md shadow-yellow-900/20"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* LISTADO DINÁMICO DE APUESTAS */}
              <div className="space-y-3">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-t-yellow-400 border-gray-800 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sincronizando con el servidor...</p>
                  </div>
                ) : filteredBets.length === 0 ? (
                  <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
                    No se encontraron boletos de apuestas en esta categoría.
                  </div>
                ) : (
                  filteredBets.map((bet) => (
                    <div
                      key={bet.bet_id}
                      className="bg-gradient-to-br from-gray-900/70 to-black/90 border border-gray-800/80 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-700/60"
                    >
                      {/* Detalles del Encuentro */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                          <span>⚽ {bet.match?.competition || "Mundial 2026"}</span>
                          <span>•</span>
                          <span>{bet.created_at ? new Date(bet.created_at).toLocaleDateString() : "---"}</span>
                        </div>

                        {/* Marcador / Equipos */}
                        <div className="flex items-center gap-3 text-base font-bold">
                          <span className="text-xl">{bet.match?.home_team?.flag || "🏳️"}</span>
                          <span className="text-white">{bet.match?.home_team?.name || "Local"}</span>
                          <span className="text-yellow-400 bg-black/40 border border-gray-800 px-2 py-0.5 rounded text-xs">
                            {bet.match?.home_score !== null && bet.match?.home_score !== undefined
                              ? `${bet.match.home_score} - ${bet.match.away_score}`
                              : "VS"}
                          </span>
                          <span className="text-white">{bet.match?.away_team?.name || "Visitante"}</span>
                          <span className="text-xl">{bet.match?.away_team?.flag || "🏳️"}</span>
                        </div>

                        {/* Tu Pronóstico */}
                        <div className="text-xs">
                          <span className="text-gray-500">Tu predicción: </span>
                          <span className="text-green-400 font-bold uppercase tracking-wide">
                            {bet.prediction}
                          </span>
                        </div>
                      </div>

                      {/* Montos y Ganancias */}
                      <div className="flex items-center md:justify-end gap-6 border-t md:border-t-0 border-gray-800 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">Importe</span>
                          <span className="text-white font-black text-sm">${bet.amount}.00</span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                            Retorno Potencial
                          </span>
                          <span
                            className={`font-black text-sm ${
                              bet.status === "WON"
                                ? "text-green-400"
                                : bet.status === "LOST"
                                ? "text-gray-500 line-through"
                                : "text-yellow-400"
                            }`}
                          >
                            ${bet.potential_payout}.00
                          </span>
                        </div>

                        <div className="ml-auto md:ml-0">{getStatusBadge(bet.status)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-900 bg-black px-4 py-6 text-center mt-10">
        <p className="text-gray-700 text-xs">© 2026 MundialBet. +18 · Juega con responsabilidad.</p>
      </footer>
    </>
  );
}