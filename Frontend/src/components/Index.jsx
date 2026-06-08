import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE EJEMPLO
// En producción estos vendrían de tu API con fetch('/api/matches') etc.
// ─────────────────────────────────────────────────────────────────────────────

// Partidos del Mundial 2026 de ejemplo
// Cada objeto representa un partido con sus cuotas y metadatos
const FEATURED_MATCHES = [
  {
    id: 1,
    group: 'Grupo A',
    flagA: '🇧🇷', teamA: 'Brasil',
    flagB: '🇦🇷', teamB: 'Argentina',
    time: 'Hoy 20:00 ET',
    venue: 'MetLife Stadium · New York',
    oddsA: 2.20,
    oddsDraw: 3.10,
    oddsB: 3.40,
    live: true,
    minute: "67'",
    scoreA: 1,
    scoreB: 1,
  },
  {
    id: 2,
    group: 'Grupo C',
    flagA: '🇫🇷', teamA: 'Francia',
    flagB: '🇩🇪', teamB: 'Alemania',
    time: 'Hoy 17:00 ET',
    venue: 'SoFi Stadium · Los Ángeles',
    oddsA: 1.90,
    oddsDraw: 3.50,
    oddsB: 4.00,
    live: false,
    minute: null,
    scoreA: null,
    scoreB: null,
  },
  {
    id: 3,
    group: 'Octavos',
    flagA: '🇵🇹', teamA: 'Portugal',
    flagB: '🇲🇦', teamB: 'Marruecos',
    time: 'Mañana 14:00 ET',
    venue: 'AT&T Stadium · Dallas',
    oddsA: 1.75,
    oddsDraw: 3.60,
    oddsB: 4.80,
    live: false,
    minute: null,
    scoreA: null,
    scoreB: null,
  },
]

// Grupos del Mundial con sus selecciones, para la sección de apuestas por grupo
const WORLD_CUP_GROUPS = [
  { group: 'A', teams: ['🇺🇸 EE.UU.', '🇬🇧 Inglaterra', '🇮🇷 Irán', '🏴󠁧󠁢󠁷󠁬󠁳󠁿 Gales'] },
  { group: 'B', teams: ['🇳🇱 Países Bajos', '🇸🇳 Senegal', '🇪🇨 Ecuador', '🇶🇦 Qatar'] },
  { group: 'C', teams: ['🇦🇷 Argentina', '🇸🇦 Arabia S.', '🇲🇽 México', '🇵🇱 Polonia'] },
  { group: 'D', teams: ['🇫🇷 Francia', '🇩🇰 Dinamarca', '🇹🇳 Túnez', '🇦🇺 Australia'] },
]

// Mercados especiales del Mundial — tipos de apuestas adicionales
const SPECIAL_MARKETS = [
  { icon: '🏆', title: 'Campeón del Mundial', desc: 'Apuesta al ganador del torneo', odds: 'Desde 4.50' },
  { icon: '⚽', title: 'Máximo Goleador', desc: 'Quién anota más en el torneo', odds: 'Desde 6.00' },
  { icon: '🥅', title: 'Goles Totales Fase Grupos', desc: 'Over/Under del torneo completo', odds: '1.95 / 1.85' },
  { icon: '🌍', title: 'Mejor Confederación', desc: 'CONMEBOL vs UEFA vs el resto', odds: 'Desde 1.30' },
]

// Estadísticas del sitio en tiempo real (falsas, para demostración)
const LIVE_STATS = [
  { label: 'Partidos Hoy', value: '12', icon: '⚽' },
  { label: 'Apuestas Activas', value: '48,320', icon: '🎯' },
  { label: 'Jackpot Acumulado', value: '$1.2M', icon: '🏆' },
  { label: 'Usuarios Online', value: '23,841', icon: '👥' },
]


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: OddsButton
// El botón individual de cada cuota (1 / X / 2)
//
// Props:
//   label      → '1', 'X' o '2'  (la etiqueta que aparece encima del número)
//   value      → número decimal de la cuota, ej: 2.20
//   isSelected → booleano: true si el usuario ya hizo clic en este botón
//   onClick    → función que se llama al hacer clic
// ─────────────────────────────────────────────────────────────────────────────
function OddsButton({ label, value, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      // Las clases de Tailwind cambian condicionalmente según isSelected
      // Cuando isSelected es true: fondo amarillo dorado, texto negro (contraste máximo)
      // Cuando isSelected es false: fondo semitransparente oscuro con borde gris
      className={`
        flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border
        transition-all duration-200 font-bold text-sm select-none
        ${isSelected
          ? 'bg-yellow-400 border-yellow-300 text-black shadow-lg shadow-yellow-900/30 scale-105'
          : 'bg-black/40 border-gray-700 text-gray-300 hover:bg-black/60 hover:border-yellow-600/50 hover:text-yellow-300'
        }
      `}
    >
      {/* Etiqueta pequeña: '1', 'X', '2' — levemente transparente */}
      <span className="text-[10px] font-bold opacity-60 mb-0.5 tracking-widest">{label}</span>
      {/* Valor de la cuota. toFixed(2) garantiza siempre 2 decimales: 2.2 → "2.20" */}
      <span className="text-base font-black">{value.toFixed(2)}</span>
    </button>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: MatchCard
// Tarjeta de un partido del Mundial con cuotas seleccionables
//
// Props:
//   match → objeto completo del partido (ver array FEATURED_MATCHES arriba)
// ─────────────────────────────────────────────────────────────────────────────
function MatchCard({ match }) {
  // selected guarda cuál cuota eligió el usuario: 'A', 'D' (draw/empate) o 'B'
  // null significa que no hay ninguna seleccionada
  const [selected, setSelected] = useState(null)

  // Al hacer clic en una cuota:
  // - Si era la misma que ya estaba seleccionada → la deselecciona (toggle)
  // - Si era otra → selecciona la nueva
  // La función recibe 'key' que es el identificador de la cuota ('A', 'D', 'B')
  const handleOdds = (key) => setSelected(prev => prev === key ? null : key)

  return (
    // group: clase de Tailwind que permite que los hijos reaccionen al hover del padre
    // usando group-hover: en los hijos
    <div className="relative group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-600/40 hover:shadow-xl hover:shadow-yellow-900/10">

      {/* Línea de acento superior — visible solo al hacer hover, transición de opacidad */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Franja superior verde oscuro: grupo del Mundial + badge EN VIVO */}
      <div className="bg-green-900/40 border-b border-green-900/60 px-4 py-2 flex items-center justify-between">
        <span className="text-green-400 text-xs font-black uppercase tracking-widest">
          {match.group}
        </span>

        {/* Badge EN VIVO — solo se renderiza si match.live === true */}
        {/* En JSX, la expresión {match.live && <elemento>} solo renderiza el elemento si match.live es verdadero */}
        {match.live && (
          <span className="flex items-center gap-1.5 text-xs font-black text-red-400 bg-red-950/50 border border-red-900/50 px-2.5 py-0.5 rounded-full">
            {/* Punto animado con animate-ping: crea el efecto de "pulso" de radar */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            EN VIVO {match.minute}
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Área de equipos: Bandera + Nombre — Marcador (si está en vivo) — Bandera + Nombre */}
        <div className="flex items-center justify-between mb-5">

          {/* Equipo A: bandera + nombre, alineado a la izquierda */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-3xl">{match.flagA}</span>
            <p className="text-white font-bold text-sm text-center leading-tight">{match.teamA}</p>
          </div>

          {/* Centro: marcador si está en vivo, o "VS" si no ha comenzado */}
          <div className="px-4 flex flex-col items-center">
            {match.live
              ? (
                  // Si está en vivo mostramos el marcador actual
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-yellow-400">{match.scoreA}</span>
                    <span className="text-gray-600 font-bold">–</span>
                    <span className="text-2xl font-black text-yellow-400">{match.scoreB}</span>
                  </div>
                )
              : (
                  // Si no ha comenzado, mostramos "VS"
                  <span className="text-gray-600 text-sm font-black tracking-widest">VS</span>
                )
            }
          </div>

          {/* Equipo B: nombre + bandera, alineado a la derecha */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-3xl">{match.flagB}</span>
            <p className="text-white font-bold text-sm text-center leading-tight">{match.teamB}</p>
          </div>
        </div>

        {/* Sede del partido — icono + texto descriptivo */}
        <p className="text-gray-600 text-xs text-center mb-4 flex items-center justify-center gap-1">
          <span>📍</span> {match.venue}
        </p>

        {/* Fila de botones de cuotas: siempre son 3 en el fútbol (1 / X / 2) */}
        {/* grid-cols-3 divide el espacio en 3 columnas iguales */}
        <div className="grid grid-cols-3 gap-2">
          <OddsButton label="1" value={match.oddsA}    isSelected={selected === 'A'} onClick={() => handleOdds('A')} />
          <OddsButton label="X" value={match.oddsDraw} isSelected={selected === 'D'} onClick={() => handleOdds('D')} />
          <OddsButton label="2" value={match.oddsB}    isSelected={selected === 'B'} onClick={() => handleOdds('B')} />
        </div>

        {/* Hora del partido */}
        <p className="text-gray-600 text-xs text-center mt-3">{match.time}</p>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: StatBadge
// Tarjeta pequeña de estadística (número + label + icono)
// Completamente sin estado (dumb component), solo muestra lo que recibe
// ─────────────────────────────────────────────────────────────────────────────
function StatBadge({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center bg-black/50 border border-gray-800 rounded-xl p-4 text-center">
      <span className="text-2xl mb-1">{icon}</span>
      <p className="text-yellow-400 text-xl font-black">{value}</p>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: GroupCard
// Tarjeta de grupo del Mundial con sus 4 selecciones
// ─────────────────────────────────────────────────────────────────────────────
function GroupCard({ group, teams }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-yellow-700/40 transition-colors duration-200">
      {/* Encabezado: "GRUPO A" con acento verde */}
      <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-green-500 rounded-full inline-block" />
        Grupo {group}
      </p>
      {/* Lista de equipos del grupo */}
      <ul className="flex flex-col gap-1.5">
        {/* teams.map() convierte el array de strings en elementos de lista */}
        {teams.map((team) => (
          <li key={team} className="text-gray-300 text-sm flex items-center justify-between group/item cursor-pointer hover:text-yellow-300 transition-colors">
            <span>{team}</span>
            {/* La flecha aparece al hacer hover con group-hover */}
            <span className="text-gray-700 group-hover/item:text-yellow-400 transition-colors text-xs">›</span>
          </li>
        ))}
      </ul>
      {/* Botón para ver las apuestas del grupo */}
      <button className="mt-3 w-full text-xs text-green-400 border border-green-900/50 hover:bg-green-900/20 rounded-lg py-1.5 transition-colors font-bold">
        Ver apuestas del grupo
      </button>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: MarketCard
// Tarjeta de mercado especial del Mundial (campeón, goleador, etc.)
// ─────────────────────────────────────────────────────────────────────────────
function MarketCard({ icon, title, desc, odds }) {
  return (
    <div className="group flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-yellow-600/40 hover:bg-gray-900 transition-all duration-200 cursor-pointer">
      {/* Icono en círculo con fondo amarillo semitransparente */}
      <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-gray-500 text-xs truncate">{desc}</p>
      </div>
      {/* Cuota con estilo de badge amarillo */}
      <div className="shrink-0 text-right">
        <p className="text-yellow-400 font-black text-sm">{odds}</p>
        <p className="text-gray-600 text-[10px]">ver más</p>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: Index
// El layout completo de la página principal
// ─────────────────────────────────────────────────────────────────────────────
export default function Index() {
  const navigate = useNavigate()

  // useEffect con [] vacío: se ejecuta una sola vez cuando el componente se monta
  // Es el lugar correcto para hacer fetch a la API en producción
  useEffect(() => {
    // TODO: fetch('/api/world-cup/matches') → setMatches(data)
    // TODO: fetch('/api/world-cup/stats')   → setStats(data)
  }, [])

  return (
    // flex flex-col: columna para que el footer siempre quede al fondo
    // min-h-screen: la página nunca será más corta que la pantalla completa
    <div className="min-h-screen bg-[#080808] text-white flex flex-col" style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}>

      {/* ═══════════════════════════════════════════════
          NAVBAR
          sticky top-0: se queda fijo al hacer scroll
          z-50: por encima de todos los demás elementos
          backdrop-blur-md: efecto de desenfoque del fondo (como vidrio esmerilado)
      ═══════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        {/* max-w-7xl mx-auto: limita el ancho del contenido y lo centra */}
        {/* px-4 sm:px-6 lg:px-8: padding lateral que crece con la pantalla */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2">
            {/* El emoji trofeo + nombre del sitio con colores negro/amarillo */}
            <span className="text-yellow-400 text-xl">🏆</span>
            <span className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none">
                FIFA World Cup 2026
              </span>
            </span>
          </Link>

          {/* Links de navegación — hidden en mobile, flex desde md */}
          <div className="hidden md:flex items-center gap-1">
            {/* Array de links. map() los convierte en elementos JSX */}
            {[
              { label: 'Grupos', path: '/GroupsWorldCup' },
            ].map(({ label, path }) => (
              <Link
                key={label}
                to={path}
                className="px-4 py-2 text-gray-400 hover:text-yellow-400 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Botones de acción derecha */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-gray-400 hover:text-white transition-colors px-3 py-2 uppercase tracking-wider"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-black px-4 py-2 rounded-lg transition-all hover:scale-105 uppercase tracking-wide"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          HERO
          Sección principal con el mensaje de impacto
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">

        {/* Fondo decorativo: gradientes difuminados posicionados de forma absoluta */}
        {/* pointer-events-none: no intercepta clics, es solo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Manchón verde central, grande y difuminado */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-green-900/15 blur-[120px] rounded-full" />
          {/* Manchón amarillo izquierdo, más pequeño */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400/5 blur-3xl rounded-full" />
          {/* Manchón amarillo derecho */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/8 blur-3xl rounded-full" />

          {/* Patrón de línea de campo de fútbol — decorativo con SVG inline */}
          {/* opacity-[0.03]: casi invisible, solo para dar textura */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            {/* Círculo central del campo */}
            <circle cx="50%" cy="50%" r="200" fill="none" stroke="white" strokeWidth="2"/>
            {/* Punto central */}
            <circle cx="50%" cy="50%" r="4" fill="white"/>
            {/* Línea central */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Layout de 2 columnas en pantallas grandes: texto a la izq, stats a la der */}
          {/* En mobile: columna simple */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

            {/* ─── Columna izquierda: Texto del hero ─── */}
            <div className="flex-1 text-center lg:text-left">

              {/* Badge de edición especial */}
              <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-400/5 rounded-full px-4 py-1.5 mb-6">
                <span className="text-yellow-400 text-sm">🏆</span>
                <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em]">
                  FIFA World Cup 2026 · USA · CAN · MEX
                </span>
              </div>

              {/* Título principal */}
              {/* En mobile: 4xl. En sm: 6xl. En lg: 7xl. En xl: 8xl */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight mb-4">
                {/* Primera línea: blanco puro */}
                <span className="text-white block">APUESTA AL</span>
                {/* Segunda línea: gradiente de amarillo a verde (colores del mundial) */}
                {/* bg-clip-text text-transparent: hace que el gradiente sea el color del texto */}
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                  CAMPEÓN
                </span>
                <span className="text-white block text-3xl sm:text-4xl lg:text-5xl mt-1 font-bold opacity-60">
                  del Mundo
                </span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Las mejores cuotas para los 64 partidos del Mundial. Apuesta en grupos, octavos, cuartos, semis y la gran final.
              </p>

              {/* CTAs */}
              {/* flex-col en mobile, flex-row desde sm */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide shadow-xl shadow-yellow-900/30"
                >
                  🏆 Apostar al Campeón
                </button>
                <button
                  onClick={() => navigate('/grupos')}
                  className="w-full sm:w-auto border border-green-700 hover:border-green-500 text-green-400 hover:text-green-300 font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 uppercase tracking-wide"
                >
                  Ver Fase de Grupos
                </button>
              </div>

              {/* Micro-stats bajo los CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-6">
                {[
                  '✅ 64 partidos cubiertos',
                  '✅ Cuotas en vivo',
                  '✅ Retiro en 24h',
                ].map((item) => (
                  <span key={item} className="text-gray-500 text-xs">{item}</span>
                ))}
              </div>
            </div>

            {/* ─── Columna derecha: Stats del torneo ─── */}
            {/* En mobile aparece abajo, en lg aparece al lado */}
            <div className="lg:w-72 xl:w-80">
              {/* Caja con borde amarillo y fondo oscuro */}
              <div className="bg-gray-900/60 border border-yellow-900/40 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-4 text-center">
                  Torneo en números
                </p>
                {/* grid-cols-2: 4 estadísticas en 2x2 */}
                <div className="grid grid-cols-2 gap-3">
                  {LIVE_STATS.map((stat, i) => (
                    // Pasamos las props del objeto stat directamente con spread {...stat}
                    // Equivale a icon={stat.icon} label={stat.label} value={stat.value}
                    <StatBadge key={i} {...stat} />
                  ))}
                </div>

                {/* Bono de bienvenida dentro del box */}
                <div className="mt-4 bg-green-900/20 border border-green-800/40 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-1">Bono de bienvenida</p>
                  <p className="text-white text-3xl font-black">100% <span className="text-yellow-400">hasta $300</span></p>
                  <p className="text-gray-500 text-xs mt-1">en tu primer depósito · sin código</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PARTIDOS EN VIVO / PRÓXIMOS
      ═══════════════════════════════════════════════ */}
      <section className="py-14 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Encabezado de sección */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide flex items-center gap-3">
              {/* Barra vertical de acento verde — decoración */}
              <span className="w-1 h-8 bg-green-500 rounded-full" />
              Partidos Destacados
            </h2>
            <Link
              to="/partidos"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-black uppercase tracking-wider transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {/* Grid de tarjetas de partidos */}
          {/* 1 columna en mobile → 2 en md → 3 en lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_MATCHES.map((match) => (
              // key obligatorio en listas. Usamos match.id que es único
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECCIÓN DE GRUPOS
      ═══════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-950/50 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide flex items-center gap-3">
              <span className="w-1 h-8 bg-yellow-400 rounded-full" />
              Fase de Grupos
            </h2>
            <Link
              to="/grupos"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-black uppercase tracking-wider transition-colors"
            >
              Todos los grupos →
            </Link>
          </div>

          {/* 1 col en mobile → 2 en sm → 4 en lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* WORLD_CUP_GROUPS.map() itera el array y renderiza una GroupCard por grupo */}
            {WORLD_CUP_GROUPS.map((g) => (
              // key={g.group}: usamos la letra del grupo como identificador único
              <GroupCard key={g.group} group={g.group} teams={g.teams} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide flex items-center gap-3">
              <span className="w-1 h-8 bg-green-500 rounded-full" />
              Mercados Especiales
            </h2>
            <p className="text-gray-500 text-sm mt-2 ml-4">Apuestas al torneo completo, no solo a partidos</p>
          </div>

          {/* 1 columna en mobile → 2 columnas en md */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SPECIAL_MARKETS.map((market, i) => (
              <MarketCard key={i} {...market} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="mt-auto border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Grid superior del footer */}
          {/* 1 col mobile → 2 col sm → 4 col md */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* Columna 1: Marca y descripción */}
            <div className="sm:col-span-2 md:col-span-1">
              <p className="text-white font-black text-lg mb-1">
                MUNDIAL<span className="text-yellow-400">BET</span>
              </p>
              <p className="text-green-400 text-[10px] uppercase tracking-widest font-bold mb-3">
                FIFA World Cup 2026
              </p>
              <p className="text-gray-600 text-xs leading-relaxed">
                La plataforma de apuestas oficiales del Mundial 2026. 64 partidos, las mejores cuotas.
              </p>
            </div>

            {/* Columnas dinámicas: Object.entries itera un objeto y devuelve [clave, valor][] */}
            {/* Cada entrada del objeto es una sección del footer con su lista de links */}
            {Object.entries({
              Apuestas: ['Grupos', 'Octavos', 'Cuartos de Final', 'Semifinal', 'Final'],
              Información: ['Sobre nosotros', 'Blog', 'Afiliados', 'Prensa'],
              Legal: ['Términos y condiciones', 'Política de privacidad', 'Juego responsable'],
            }).map(([section, links]) => (
              <div key={section}>
                <p className="text-white font-black text-xs uppercase tracking-widest mb-3">{section}</p>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        // replace(/ /g, '-'): reemplaza TODOS los espacios con guiones para la URL
                        // La 'g' en el regex significa global → aplica a todas las ocurrencias
                        to={`/${link.toLowerCase().replace(/ /g, '-')}`}
                        className="text-gray-600 hover:text-gray-300 text-xs transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Línea inferior con copyright */}
          <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-700 text-xs">
              &copy; {new Date().getFullYear()} MundialBet. Todos los derechos reservados.
            </p>
            <p className="text-gray-700 text-xs">
              +18 · Juega con responsabilidad · No es una apuesta oficial de la FIFA
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}