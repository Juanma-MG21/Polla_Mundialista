import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLogout } from '../hooks/useLogout'
import { fetchCurrentUser, getUserDisplayName } from '../utils/auth'

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE EJEMPLO
// En producción estos vendrían de tu API: fetch('/api/dashboard/stats') etc.
// ─────────────────────────────────────────────────────────────────────────────

// Tarjetas de estadísticas del panel principal
// Cada objeto define qué muestra una tarjeta del grid central
const STAT_CARDS = [
  {
    id: 'users',
    icon: '👥',
    title: 'Usuarios Registrados',
    value: '3,482',
    // delta: cambio respecto al período anterior, positivo = verde, negativo = rojo
    delta: '+124 esta semana',
    deltaPositive: true,
    sub: 'Cuentas activas en la plataforma',
    accentColor: 'yellow',
  },
  {
    id: 'bets',
    icon: '🎯',
    title: 'Apuestas Totales',
    value: '18,940',
    delta: '+892 hoy',
    deltaPositive: true,
    sub: 'Apuestas realizadas en el Mundial',
    accentColor: 'green',
  },
  {
    id: 'volume',
    icon: '💰',
    title: 'Volumen Apostado',
    value: '$241,830',
    delta: '+$12,400 hoy',
    deltaPositive: true,
    sub: 'Total acumulado en el torneo',
    accentColor: 'yellow',
  },
  {
    id: 'live',
    icon: '📡',
    title: 'Apuestas En Vivo',
    value: '1,204',
    delta: 'Ahora mismo',
    deltaPositive: true,
    sub: 'Usuarios apostando en este momento',
    accentColor: 'green',
  },
]

// Actividad reciente — simulando movimientos reales de la plataforma
// En producción: fetch('/api/movements?limit=5')
const RECENT_ACTIVITY = [
  { user: 'juan_m92',     action: 'Apuesta', target: 'Brasil vs Argentina',  amount: '+$50.00',  time: 'hace 2 min',  win: true  },
  { user: 'carlos_bet',   action: 'Retiro',  target: 'Billetera principal',   amount: '-$120.00', time: 'hace 5 min',  win: false },
  { user: 'sofia_wc26',   action: 'Apuesta', target: 'Francia vs Alemania',  amount: '+$30.00',  time: 'hace 8 min',  win: true  },
  { user: 'pedro_gol',    action: 'Depósito',target: 'Ingreso de fondos',     amount: '+$200.00', time: 'hace 12 min', win: true  },
  { user: 'ana_futbol',   action: 'Apuesta', target: 'Portugal vs Marruecos', amount: '+$75.00',  time: 'hace 18 min', win: true  },
]

// Links del sidebar con sus iconos SVG y ruta destino
// Separamos los datos de la UI para que sea fácil agregar/quitar items
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    // SVG de casa/home
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    path: '/Usuarios',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Movimientos',
    path: '/dashboard/movimientos',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="16 3 21 8 16 13"/><line x1="21" y1="8" x2="9" y2="8"/>
        <polyline points="8 21 3 16 8 11"/><line x1="3" y1="16" x2="15" y2="16"/>
      </svg>
    ),
  },
  {
    label: 'Historial',
    path: '/dashboard/historial',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
      </svg>
    ),
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: StatCard
// Tarjeta individual del grid de estadísticas
//
// Props:
//   icon           → emoji del ícono decorativo
//   title          → nombre de la métrica
//   value          → valor principal (string, ej: "3,482")
//   delta          → texto de cambio reciente (ej: "+124 esta semana")
//   deltaPositive  → boolean: true = verde, false = rojo
//   sub            → texto descriptivo debajo del valor
//   accentColor    → 'yellow' | 'green' — color del borde superior de la tarjeta
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ icon, title, value, delta, deltaPositive, sub, accentColor }) {
  return (
    // group: permite efectos hover en hijos con group-hover:
    // relative: necesario para posicionar la línea de acento superior (absolute)
    <div className="relative group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 overflow-hidden">

      {/* Línea de color superior — amarilla o verde según accentColor */}
      {/* h-[3px]: borde más grueso para mayor impacto visual */}
      <div className={`absolute top-0 inset-x-0 h-[3px] ${accentColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`} />

      {/* Fila superior: título + icono */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{title}</p>
        {/* Circulo de fondo semitransparente alrededor del emoji */}
        <span className="text-2xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center border border-gray-800">
          {icon}
        </span>
      </div>

      {/* Valor principal — número grande y en negrita */}
      <p className="text-white text-4xl font-black mb-2 tracking-tight">{value}</p>

      {/* Delta — cambia de color según deltaPositive */}
      <p className={`text-xs font-bold mb-1 ${deltaPositive ? 'text-green-400' : 'text-red-400'}`}>
        {/* Flecha que indica dirección del cambio */}
        {deltaPositive ? '↑ ' : '↓ '}{delta}
      </p>

      {/* Descripción secundaria */}
      <p className="text-gray-600 text-xs">{sub}</p>

      {/* Brillo decorativo de fondo al hacer hover */}
      {/* opacity-0 por defecto, group-hover:opacity-100 al pasar el mouse sobre la card */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accentColor === 'yellow' ? 'bg-yellow-400' : 'bg-green-400'}`} />
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: ActivityRow
// Fila individual de la tabla de actividad reciente
//
// Props:
//   user    → nombre de usuario
//   action  → tipo de acción ('Apuesta', 'Retiro', 'Depósito')
//   target  → descripción del destino (partido o billetera)
//   amount  → monto con signo ("+$50.00" o "-$120.00")
//   time    → tiempo relativo ("hace 2 min")
//   win     → boolean para colorear el badge de acción
// ─────────────────────────────────────────────────────────────────────────────
function ActivityRow({ user, action, target, amount, time, win }) {
  // Determinamos el color del badge de acción según el tipo
  // Los ternarios encadenados funcionan como if/else if/else
  const actionColor =
    action === 'Depósito' ? 'text-green-400 bg-green-900/30 border-green-800/50' :
    action === 'Retiro'   ? 'text-red-400 bg-red-900/30 border-red-800/50' :
                            'text-yellow-400 bg-yellow-900/30 border-yellow-800/50'

  return (
    // hover:bg-gray-900/60: resalta la fila al pasar el cursor
    <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-900/60 transition-colors duration-150 group">

      {/* Avatar del usuario: iniciales en círculo */}
      {/* user[0].toUpperCase(): toma el primer carácter del nombre y lo pone en mayúscula */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-black text-yellow-400">
        {user[0].toUpperCase()}
      </div>

      {/* Info central: usuario + acción */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold truncate">{user}</p>
        {/* truncate: corta el texto con "..." si no cabe en el ancho disponible */}
        <p className="text-gray-500 text-xs truncate">{target}</p>
      </div>

      {/* Badge de tipo de acción */}
      <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${actionColor}`}>
        {action}
      </span>

      {/* Monto — verde si positivo (comienza con '+'), rojo si negativo */}
      <p className={`shrink-0 text-sm font-black ${amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
        {amount}
      </p>

      {/* Tiempo — oculto en mobile muy pequeño, visible desde sm */}
      <p className="hidden sm:block shrink-0 text-gray-600 text-xs">{time}</p>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: Sidebar
// Barra lateral de navegación
//
// Props:
//   isOpen      → boolean: true = visible en mobile (drawer abierto)
//   onClose     → función para cerrar el drawer en mobile
//   currentPath → string: path actual para marcar el link activo
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ isOpen, onClose, currentPath }) {
  const handleLogout = useLogout()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

  const displayName = getUserDisplayName(user)
  const userEmail = user?.email || 'Sin correo'
  const userInitial = displayName[0]?.toUpperCase() || 'U'

  return (
    <>
      {/* Overlay oscuro — solo en mobile cuando el sidebar está abierto */}
      {/* Hace clic para cerrar el sidebar al tocar fuera de él */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar contenedor */}
      {/* En mobile: posición fija, se desliza con translate-x */}
      {/* En lg: posición sticky, siempre visible */}
      {/* transition-transform: la animación de entrada/salida del drawer mobile */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 z-40 flex flex-col
        bg-black border-r border-gray-900
        transition-transform duration-300 ease-in-out
        lg:sticky lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Logo en el sidebar */}
        <div className="p-6 border-b border-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">🏆</span>
            <div>
              <p className="text-white font-black text-base leading-none tracking-tight">
                MUNDIAL<span className="text-yellow-400">BET</span>
              </p>
              <p className="text-green-400 text-[9px] uppercase tracking-[0.25em] font-bold">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Etiqueta de sección */}
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.25em] font-bold mb-3 px-3">
            Navegación
          </p>
          <ul className="flex flex-col gap-1">
            {/* NAV_ITEMS.map(): convierte el array de links en elementos <li> */}
            {NAV_ITEMS.map(({ label, path, icon }) => {
              // Comparamos el path del link con el path actual para saber si está activo
              // El link activo recibe estilos distintos (fondo, color de texto)
              const isActive = currentPath === path

              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={onClose}
                    // Template literal que mezcla clases fijas con condicionales según isActive
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
                      transition-all duration-200
                      ${isActive
                        // Activo: fondo amarillo semitransparente, borde amarillo, texto amarillo
                        ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400'
                        // Inactivo: sin fondo, texto gris, hover con fondo blanco muy suave
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                      }
                    `}
                  >
                    {/* El ícono SVG viene del array NAV_ITEMS */}
                    <span className={isActive ? 'text-yellow-400' : 'text-gray-600 group-hover:text-white'}>
                      {icon}
                    </span>
                    {label}

                    {/* Indicador de punto activo — solo cuando está seleccionado */}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Separador */}
          <div className="border-t border-gray-900 my-4" />

          {/* Link de configuración */}
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.25em] font-bold mb-3 px-3">
            Sistema
          </p>
          <Link
            to="/dashboard/config"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            {/* Ícono de ajustes/configuración */}
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Configuración
          </Link>
        </nav>

        {/* Perfil de admin en la parte inferior del sidebar */}
        {/* mt-auto: empuja este bloque hasta el fondo disponible */}
        <div className="p-4 border-t border-gray-900">
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar del admin */}
              <div className="w-9 h-9 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-black text-sm">
                {userInitial}
              </div>
              <div>
                <p className="text-white text-xs font-bold">{displayName}</p>
                <p className="text-gray-500 text-[10px] truncate">{userEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/40 border border-red-900/50 text-red-400 text-xs font-black py-2 rounded-lg transition-all duration-200"
            >
              {/* Ícono de salida */}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // sidebarOpen controla si el drawer del sidebar está abierto en mobile
  // En desktop el sidebar siempre está visible (controlado por CSS, no por este estado)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // useLocation() nos da el objeto de ubicación actual del router
  // location.pathname es el path actual, ej: "/dashboard" o "/dashboard/usuarios"
  // Lo usamos para marcar el link activo en el sidebar
  const location = useLocation()

  return (
    // h-screen overflow-hidden: el layout ocupa exactamente la pantalla
    // flex: sidebar al lado del contenido principal (horizontal)
    <div className="h-screen bg-[#080808] text-white flex overflow-hidden" style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}>

      {/* ─── SIDEBAR ─── */}
      {/* Pasamos sidebarOpen, la función de cierre y el pathname actual */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
      />

      {/* ─── CONTENIDO PRINCIPAL ─── */}
      {/* flex-1: ocupa todo el espacio restante que no usa el sidebar */}
      {/* overflow-y-auto: scroll vertical solo en esta columna, no en toda la página */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* ─── TOPBAR ─── */}
        {/* sticky top-0: se queda fija al hacer scroll del contenido */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-gray-900">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 gap-4">

            {/* Botón hamburguesa — solo visible en mobile (lg:hidden) */}
            <button
              onClick={() => setSidebarOpen(true)}
              // lg:hidden: en pantallas grandes (1024px+) este botón no aparece
              // porque el sidebar ya está visible permanentemente
              className="lg:hidden p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              aria-label="Abrir menú"
            >
              {/* Ícono de menú (hamburguesa) */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Título de la sección actual */}
            <div className="flex-1">
              <h1 className="text-white font-black text-lg uppercase tracking-wide">
                Panel de Control
              </h1>
              <p className="text-gray-600 text-xs hidden sm:block">
                FIFA World Cup 2026 · Vista general
              </p>
            </div>

            {/* Acciones del topbar: badge en vivo + notificaciones */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Badge de estado en vivo */}
              <div className="hidden sm:flex items-center gap-1.5 bg-green-900/30 border border-green-800/50 rounded-full px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                <span className="text-green-400 text-xs font-black uppercase tracking-widest">En Vivo</span>
              </div>

              {/* Botón de notificaciones */}
              <button className="relative p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-yellow-400 hover:border-yellow-900/50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {/* Punto rojo de notificaciones sin leer (decorativo) */}
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── CONTENIDO DEL DASHBOARD ─── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* SECCIÓN 1: Grid de estadísticas */}
          <section className="mb-8">
            {/* Encabezado de sección con barra de acento */}
            <h2 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-yellow-400" />
              Resumen General
            </h2>
            {/* Grid: 1 col mobile → 2 col sm → 4 col xl */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* STAT_CARDS.map() convierte cada objeto en un componente StatCard */}
              {STAT_CARDS.map((card) => (
                // key={card.id}: identificador único para que React rastree cada elemento
                // El spread {...card} pasa todas las props del objeto de una vez
                <StatCard key={card.id} {...card} />
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: Grid de dos columnas — Actividad reciente + Accesos rápidos */}
          {/* En mobile: columna simple. En lg: dos columnas, la izquierda más ancha */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

            {/* ─── Actividad Reciente ─── */}
            <section className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Header de la sección */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2 className="text-white font-black text-base uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full" />
                  Actividad Reciente
                </h2>
                <Link
                  to="/dashboard/movimientos"
                  className="text-yellow-400 hover:text-yellow-300 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Ver todo →
                </Link>
              </div>

              {/* Lista de movimientos */}
              <div className="p-2">
                {/* RECENT_ACTIVITY.map() convierte el array en filas de actividad */}
                {RECENT_ACTIVITY.map((item, i) => (
                  // key={i}: usamos el índice como key porque los datos son estáticos
                  // En datos reales deberías usar el ID del movimiento
                  <ActivityRow key={i} {...item} />
                ))}
              </div>

              {/* Footer de la sección */}
              <div className="px-6 py-3 border-t border-gray-800 text-center">
                <button className="text-gray-600 hover:text-gray-400 text-xs font-bold uppercase tracking-wider transition-colors">
                  Cargar más registros
                </button>
              </div>
            </section>

            {/* ─── Columna derecha: accesos rápidos y estado del torneo ─── */}
            <div className="flex flex-col gap-4">

              {/* Estado del torneo */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-yellow-400 rounded-full" />
                  Estado del Torneo
                </h3>
                <div className="flex flex-col gap-3">
                  {/* Cada fila es un indicador de estado del Mundial */}
                  {[
                    { label: 'Fase actual',      value: 'Fase de Grupos',  color: 'text-green-400'  },
                    { label: 'Partidos jugados', value: '24 / 64',         color: 'text-yellow-400' },
                    { label: 'Goles totales',    value: '68',              color: 'text-white'      },
                    { label: 'Próximo partido',  value: 'Hoy 17:00 ET',   color: 'text-green-400'  },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
                      {/* last:border-0: elimina el borde del último elemento de la lista */}
                      <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
                      <p className={`text-xs font-black ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones rápidas del admin */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-green-500 rounded-full" />
                  Acciones Rápidas
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    { label: '+ Agregar usuario',     path: '/dashboard/usuarios/nuevo',    color: 'border-yellow-900/50 text-yellow-400 hover:bg-yellow-900/20 hover:border-yellow-700' },
                    { label: '📊 Ver estadísticas',   path: '/dashboard/stats',             color: 'border-green-900/50 text-green-400 hover:bg-green-900/20 hover:border-green-700'  },
                    { label: '📋 Exportar reporte',   path: '/dashboard/exportar',          color: 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-500'           },
                  ].map(({ label, path, color }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`w-full text-center text-xs font-black uppercase tracking-wider py-2.5 rounded-xl border transition-all duration-200 ${color}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Banner de bono / alerta del torneo */}
              <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-900/30 rounded-2xl p-5 text-center">
                <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  🏆 World Cup 2026
                </p>
                <p className="text-white font-black text-2xl leading-none mb-1">
                  64 PARTIDOS
                </p>
                <p className="text-gray-500 text-xs mb-3">
                  USA · Canadá · México
                </p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  {/* Barra de progreso del torneo */}
                  {/* w-[37.5%] = 24/64 partidos jugados */}
                  <div className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full w-[37.5%]" />
                </div>
                <p className="text-gray-600 text-[10px] mt-1.5">37.5% del torneo completado</p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}