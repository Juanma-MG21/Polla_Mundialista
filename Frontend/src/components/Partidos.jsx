import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE EJEMPLO — en producción vendrían de fetch('/api/matches/today')
// ─────────────────────────────────────────────────────────────────────────────

// status: 'live' | 'upcoming' | 'finished'
// markets: array de mercados disponibles para apostar en ese partido
const TODAY_MATCHES = [
  {
    id: 1,
    group: 'Grupo A',
    time: '12:00 ET',
    status: 'finished',
    minute: null,
    flagA: '🇲🇽', teamA: 'México',       scoreA: 2,
    flagB: '🇿🇦', teamB: 'Sudáfrica',    scoreB: 1,
    oddsA: 1.90, oddsDraw: 3.20, oddsB: 4.10,
    venue: 'SoFi Stadium · Los Ángeles',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇲🇽 México',      odds: 1.90 },
        { key: 'X',  label: 'Empate',           odds: 3.20 },
        { key: '2',  label: '🇿🇦 Sudáfrica',    odds: 4.10 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.75 },
        { key: 'no', label: 'No',  odds: 2.05 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 1.85 },
        { key: 'under', label: 'Menos de 2.5', odds: 1.95 },
      ]},
    ],
  },
  {
    id: 2,
    group: 'Grupo C',
    time: '15:00 ET',
    status: 'live',
    minute: "54'",
    flagA: '🇧🇷', teamA: 'Brasil',       scoreA: 1,
    flagB: '🇲🇦', teamB: 'Marruecos',   scoreB: 1,
    oddsA: 1.75, oddsDraw: 3.40, oddsB: 4.80,
    venue: 'AT&T Stadium · Dallas',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇧🇷 Brasil',      odds: 1.75 },
        { key: 'X',  label: 'Empate',           odds: 3.40 },
        { key: '2',  label: '🇲🇦 Marruecos',   odds: 4.80 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.60 },
        { key: 'no', label: 'No',  odds: 2.30 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 2.00 },
        { key: 'under', label: 'Menos de 2.5', odds: 1.80 },
      ]},
      { id: 'm4', label: 'Próximo en anotar', options: [
        { key: 'A', label: '🇧🇷 Brasil',    odds: 2.10 },
        { key: 'B', label: '🇲🇦 Marruecos', odds: 3.50 },
        { key: 'N', label: 'Ninguno',       odds: 2.80 },
      ]},
    ],
  },
  {
    id: 3,
    group: 'Grupo D',
    time: '15:00 ET',
    status: 'live',
    minute: "71'",
    flagA: '🇺🇸', teamA: 'Estados Unidos', scoreA: 3,
    flagB: '🇵🇾', teamB: 'Paraguay',       scoreB: 0,
    oddsA: 1.20, oddsDraw: 6.00, oddsB: 12.00,
    venue: 'MetLife Stadium · New York',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇺🇸 EE.UU.',    odds: 1.20 },
        { key: 'X',  label: 'Empate',         odds: 6.00 },
        { key: '2',  label: '🇵🇾 Paraguay',   odds: 12.00 },
      ]},
      { id: 'm2', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 3.5',  odds: 1.50 },
        { key: 'under', label: 'Menos de 3.5', odds: 2.50 },
      ]},
    ],
  },
  {
    id: 4,
    group: 'Grupo E',
    time: '18:00 ET',
    status: 'upcoming',
    minute: null,
    flagA: '🇩🇪', teamA: 'Alemania',          scoreA: null,
    flagB: '🇪🇨', teamB: 'Ecuador',            scoreB: null,
    oddsA: 1.65, oddsDraw: 3.60, oddsB: 5.20,
    venue: 'Estadio Azteca · Ciudad de México',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇩🇪 Alemania', odds: 1.65 },
        { key: 'X',  label: 'Empate',        odds: 3.60 },
        { key: '2',  label: '🇪🇨 Ecuador',   odds: 5.20 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.80 },
        { key: 'no', label: 'No',  odds: 1.95 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 1.85 },
        { key: 'under', label: 'Menos de 2.5', odds: 1.95 },
      ]},
      { id: 'm4', label: 'Hándicap Asiático', options: [
        { key: 'A-1', label: '🇩🇪 -1',  odds: 2.20 },
        { key: 'B+1', label: '🇪🇨 +1',  odds: 1.70 },
      ]},
    ],
  },
  {
    id: 5,
    group: 'Grupo F',
    time: '18:00 ET',
    status: 'upcoming',
    minute: null,
    flagA: '🇳🇱', teamA: 'Países Bajos', scoreA: null,
    flagB: '🇯🇵', teamB: 'Japón',         scoreB: null,
    oddsA: 1.95, oddsDraw: 3.30, oddsB: 3.80,
    venue: 'BC Place · Vancouver',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇳🇱 P. Bajos', odds: 1.95 },
        { key: 'X',  label: 'Empate',        odds: 3.30 },
        { key: '2',  label: '🇯🇵 Japón',     odds: 3.80 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.70 },
        { key: 'no', label: 'No',  odds: 2.10 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 1.90 },
        { key: 'under', label: 'Menos de 2.5', odds: 1.90 },
      ]},
    ],
  },
  {
    id: 6,
    group: 'Grupo J',
    time: '21:00 ET',
    status: 'upcoming',
    minute: null,
    flagA: '🇦🇷', teamA: 'Argentina', scoreA: null,
    flagB: '🇦🇹', teamB: 'Austria',   scoreB: null,
    oddsA: 1.45, oddsDraw: 4.10, oddsB: 6.50,
    venue: 'Lumen Field · Seattle',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇦🇷 Argentina', odds: 1.45 },
        { key: 'X',  label: 'Empate',         odds: 4.10 },
        { key: '2',  label: '🇦🇹 Austria',    odds: 6.50 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.85 },
        { key: 'no', label: 'No',  odds: 1.90 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 1.75 },
        { key: 'under', label: 'Menos de 2.5', odds: 2.05 },
      ]},
      { id: 'm4', label: 'Hándicap Asiático', options: [
        { key: 'A-1', label: '🇦🇷 -1',  odds: 1.80 },
        { key: 'B+1', label: '🇦🇹 +1',  odds: 2.00 },
      ]},
    ],
  },
  {
    id: 7,
    group: 'Grupo K',
    time: '21:00 ET',
    status: 'upcoming',
    minute: null,
    flagA: '🇵🇹', teamA: 'Portugal',  scoreA: null,
    flagB: '🇨🇴', teamB: 'Colombia',  scoreB: null,
    oddsA: 1.70, oddsDraw: 3.50, oddsB: 4.60,
    venue: 'Estadio Akron · Guadalajara',
    markets: [
      { id: 'm1', label: 'Resultado Final (1X2)', options: [
        { key: '1',  label: '🇵🇹 Portugal',  odds: 1.70 },
        { key: 'X',  label: 'Empate',         odds: 3.50 },
        { key: '2',  label: '🇨🇴 Colombia',   odds: 4.60 },
      ]},
      { id: 'm2', label: 'Ambos equipos anotan', options: [
        { key: 'si', label: 'Sí',  odds: 1.65 },
        { key: 'no', label: 'No',  odds: 2.20 },
      ]},
      { id: 'm3', label: 'Total de goles', options: [
        { key: 'over',  label: 'Más de 2.5',  odds: 1.88 },
        { key: 'under', label: 'Menos de 2.5', odds: 1.92 },
      ]},
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: BetModal
// Ventana modal para realizar una apuesta sobre un partido
//
// Props:
//   match        → objeto del partido seleccionado
//   initialOdds  → { marketId, optionKey } — la cuota con la que se abrió el modal
//   onClose      → función para cerrar el modal
// ─────────────────────────────────────────────────────────────────────────────
function BetModal({ match, initialOdds, onClose }) {
  // selectedMarket: cuál de los mercados del partido está activo en el modal
  // Arranca con el mercado de la cuota que el usuario clickeó
  const [selectedMarket, setSelectedMarket] = useState(
    match.markets.find(m => m.id === initialOdds.marketId) ?? match.markets[0]
  )

  // selectedOption: qué opción dentro del mercado está seleccionada (ej: '1', 'X', '2')
  // Arranca con la opción que el usuario clickeó en la tarjeta del partido
  const [selectedOption, setSelectedOption] = useState(
    initialOdds.optionKey
  )

  // amount: el monto que el usuario quiere apostar (string para el input)
  const [amount, setAmount] = useState('')

  // submitted: true cuando el usuario confirma la apuesta (para mostrar el estado de éxito)
  const [submitted, setSubmitted] = useState(false)

  // overlayRef: referencia al div del fondo oscuro para cerrar al hacer clic fuera del modal
  const overlayRef = useRef(null)

  // La cuota seleccionada actualmente — buscamos en las opciones del mercado activo
  // find() devuelve el primer elemento que cumpla la condición, o undefined si no hay
  const currentOption = selectedMarket.options.find(o => o.key === selectedOption)

  // ganancia: cuánto recibiría el usuario si gana
  // parseFloat convierte el string 'amount' a número; si está vacío, usamos 0
  // La ganancia potencial = monto × cuota (cuota incluye el monto apostado)
  const amountNum = parseFloat(amount) || 0
  const ganancia  = currentOption ? (amountNum * currentOption.odds).toFixed(2) : '0.00'
  // toFixed(2): redondea a 2 decimales y devuelve un string

  // Montos rápidos de ejemplo para botones de acceso directo
  const QUICK_AMOUNTS = [5, 10, 25, 50, 100]

  // Cerrar el modal al hacer clic en el overlay oscuro (fuera del panel blanco)
  // e.target === overlayRef.current: solo si el clic fue exactamente en el fondo, no en el panel
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Confirmar la apuesta
  const handleConfirm = () => {
    if (!amountNum || amountNum <= 0 || !currentOption) return
    // TODO: fetch('/api/bets', { method: 'POST', body: JSON.stringify({ matchId, market, option, amount }) })
    setSubmitted(true)
  }

  // Cuando cambia el mercado activo, reseteamos la opción seleccionada
  // a la primera opción del nuevo mercado
  const handleMarketChange = (market) => {
    setSelectedMarket(market)
    // Al cambiar de mercado, seleccionamos automáticamente la primera opción
    setSelectedOption(market.options[0].key)
  }

  return (
    // Overlay: fondo oscuro semitransparente que cubre toda la pantalla
    // fixed inset-0: cubre absolutamente todo el viewport
    // z-50: encima de todo el resto del contenido
    // flex items-end sm:items-center: en mobile el modal sube desde abajo; en desktop se centra
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Panel del modal */}
      {/* rounded-t-3xl en mobile (solo esquinas superiores redondeadas, como un sheet) */}
      {/* rounded-2xl en sm+ (todas las esquinas) */}
      <div className="relative w-full sm:max-w-lg bg-gray-950 border border-gray-800 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/60">

        {/* Línea de acento superior amarilla */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        {/* ── HEADER del modal ── */}
        <div className="bg-black/60 border-b border-gray-900 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{match.group}</p>
            <h3 className="text-white font-black text-lg leading-tight">
              {match.flagA} {match.teamA} <span className="text-gray-600">vs</span> {match.flagB} {match.teamB}
            </h3>
          </div>
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white transition-all flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Si ya se confirmó la apuesta, mostramos el estado de éxito */}
        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
            {/* Checkmark animado */}
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-3xl animate-bounce">
              ✅
            </div>
            <div>
              <p className="text-white font-black text-2xl mb-1">¡Apuesta Registrada!</p>
              <p className="text-gray-400 text-sm">
                Apostaste <span className="text-yellow-400 font-bold">${amountNum.toFixed(2)}</span> a{' '}
                <span className="text-white font-bold">{currentOption?.label}</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Ganancia potencial: <span className="text-green-400 font-black">${ganancia}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 px-8 rounded-xl transition-all text-sm uppercase tracking-wide"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">

            {/* ── SELECTOR DE MERCADO ── */}
            {/* Tabs horizontales con scroll horizontal si hay muchos */}
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Mercado</p>
              {/* overflow-x-auto: scroll horizontal en mobile si los tabs no caben */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {match.markets.map((market) => (
                  <button
                    key={market.id}
                    onClick={() => handleMarketChange(market)}
                    className={`
                      shrink-0 text-xs font-black uppercase tracking-wide px-3 py-2 rounded-xl border transition-all duration-200 whitespace-nowrap
                      ${selectedMarket.id === market.id
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                      }
                    `}
                  >
                    {market.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── OPCIONES DEL MERCADO ── */}
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Selecciona tu apuesta</p>
              {/* grid dinámico: si hay 2 opciones → 2 cols, si hay 3 → 3 cols, si hay más → 2 cols */}
              <div className={`grid gap-2 ${selectedMarket.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {selectedMarket.options.map((option) => {
                  // isSelected: true si esta opción es la actualmente elegida
                  const isSelected = selectedOption === option.key
                  return (
                    <button
                      key={option.key}
                      onClick={() => setSelectedOption(option.key)}
                      className={`
                        flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200 font-bold
                        ${isSelected
                          ? 'bg-yellow-400 border-yellow-300 text-black scale-[1.03] shadow-lg shadow-yellow-900/30'
                          : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="text-xs opacity-70 mb-0.5 truncate max-w-full px-1 text-center">{option.label}</span>
                      <span className="text-xl font-black">{option.odds.toFixed(2)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── MONTO A APOSTAR ── */}
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Monto a apostar (USD)</p>

              {/* Botones de monto rápido */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    // Al hacer clic, establece el monto directamente como string
                    onClick={() => setAmount(String(q))}
                    className={`
                      flex-1 min-w-[44px] py-2 rounded-lg border text-xs font-black transition-all duration-150
                      ${amount === String(q)
                        ? 'bg-green-500 border-green-400 text-black'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                      }
                    `}
                  >
                    ${q}
                  </button>
                ))}
              </div>

              {/* Input manual de monto */}
              <div className="relative">
                {/* Signo $ posicionado de forma absoluta a la izquierda del input */}
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-black text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  // onChange: actualiza el estado amount con el nuevo valor del input
                  // e.target.value siempre es string; lo dejamos así para el input
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-900 border border-gray-800 focus:border-yellow-500/60 text-white font-black text-lg pl-8 pr-4 py-3 rounded-xl outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* ── RESUMEN DE LA APUESTA ── */}
            {/* Solo se muestra cuando hay un monto válido y una opción seleccionada */}
            {amountNum > 0 && currentOption && (
              <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-green-400 text-[10px] font-black uppercase tracking-widest">Resumen de apuesta</p>
                {/* Cada fila muestra label → valor */}
                {[
                  { label: 'Selección',    value: currentOption.label,              color: 'text-white' },
                  { label: 'Cuota',        value: currentOption.odds.toFixed(2),    color: 'text-yellow-400' },
                  { label: 'Monto',        value: `$${amountNum.toFixed(2)}`,        color: 'text-white' },
                  { label: 'Ganancia potencial', value: `$${ganancia}`,             color: 'text-green-400 text-lg font-black' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── BOTÓN CONFIRMAR ── */}
            <button
              onClick={handleConfirm}
              // disabled si no hay monto válido o no hay opción seleccionada
              disabled={!amountNum || amountNum <= 0 || !currentOption}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-black text-base py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide shadow-lg shadow-yellow-900/20"
            >
              {amountNum > 0 && currentOption
                ? `✅ Confirmar apuesta · $${amountNum.toFixed(2)}`
                : 'Ingresa un monto para apostar'
              }
            </button>

            <p className="text-gray-700 text-[10px] text-center">
              Al confirmar aceptas los Términos y Condiciones · +18 · Juega responsablemente
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: MatchRow
// Fila de partido en la lista del día — versión expandida con todos sus mercados
//
// Props:
//   match    → objeto del partido
//   onBet    → función(matchId, marketId, optionKey) — abre el modal con esa cuota
// ─────────────────────────────────────────────────────────────────────────────
function MatchRow({ match, onBet }) {
  // expanded: controla si se muestran los mercados adicionales (más allá del 1X2)
  const [expanded, setExpanded] = useState(false)

  // statusConfig: objeto con las clases y label según el estado del partido
  // Permite manejar los tres estados (live, upcoming, finished) en un solo lugar
  const statusConfig = {
    live:     { dot: 'bg-red-500',    badge: 'text-red-400 bg-red-900/30 border-red-900/50',     label: `EN VIVO ${match.minute}` },
    upcoming: { dot: 'bg-yellow-400', badge: 'text-yellow-400 bg-yellow-900/20 border-yellow-900/40', label: match.time },
    finished: { dot: 'bg-gray-600',   badge: 'text-gray-500 bg-gray-900 border-gray-800',         label: 'FINALIZADO' },
  }[match.status]

  // isFinished: los partidos finalizados no tienen cuotas clickeables
  const isFinished = match.status === 'finished'

  return (
    // article: elemento semántico correcto para un ítem de lista de contenido
    <article className="relative group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-600/30 hover:shadow-xl hover:shadow-yellow-950/20">

      {/* Línea superior de acento — visible al hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* ── CABECERA: grupo + badge de estado ── */}
      <div className="bg-green-900/30 border-b border-green-900/40 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xs font-black uppercase tracking-widest">{match.group}</span>
          <span className="text-gray-700">·</span>
          <span className="text-gray-500 text-xs">📍 {match.venue}</span>
        </div>

        {/* Badge de estado con punto animado para EN VIVO */}
        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border px-2.5 py-1 rounded-full ${statusConfig.badge}`}>
          {match.status === 'live' && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
          )}
          {match.status === 'upcoming' && <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />}
          {statusConfig.label}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* ── CUERPO: equipos + cuotas principales (1X2) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Equipos */}
          <div className="flex items-center justify-between sm:justify-start sm:gap-6 flex-1">
            {/* Equipo A */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 min-w-0">
              <span className="text-4xl">{match.flagA}</span>
              <p className="text-white font-black text-sm text-center sm:text-left truncate max-w-[80px] sm:max-w-none">{match.teamA}</p>
            </div>

            {/* Marcador o VS */}
            <div className="flex flex-col items-center px-3 shrink-0">
              {match.status !== 'upcoming'
                ? (
                  // Marcador: dos números separados por guión
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${match.status === 'live' ? 'text-yellow-400' : 'text-white'}`}>{match.scoreA}</span>
                    <span className="text-gray-600 font-bold text-lg">–</span>
                    <span className={`text-2xl font-black ${match.status === 'live' ? 'text-yellow-400' : 'text-white'}`}>{match.scoreB}</span>
                  </div>
                ) : (
                  // VS cuando el partido no ha comenzado
                  <span className="text-gray-600 text-sm font-black tracking-widest">VS</span>
                )
              }
              {/* Hora debajo del marcador/VS */}
              <span className="text-gray-600 text-[10px] mt-0.5 font-bold">{match.time}</span>
            </div>

            {/* Equipo B */}
            <div className="flex flex-col items-center sm:flex-row-reverse sm:items-center gap-2 min-w-0">
              <span className="text-4xl">{match.flagB}</span>
              <p className="text-white font-black text-sm text-center sm:text-right truncate max-w-[80px] sm:max-w-none">{match.teamB}</p>
            </div>
          </div>

          {/* Cuotas principales (1X2) del primer mercado */}
          {/* Si está finalizado, las cuotas se muestran opacas y no son clickeables */}
          <div className="flex gap-2 sm:ml-auto">
            {match.markets[0].options.map((option) => (
              <button
                key={option.key}
                onClick={() => !isFinished && onBet(match.id, match.markets[0].id, option.key)}
                disabled={isFinished}
                className={`
                  flex flex-col items-center flex-1 sm:w-16 py-2.5 px-2 rounded-xl border transition-all duration-200 font-bold
                  ${isFinished
                    ? 'bg-gray-900/50 border-gray-800 text-gray-700 cursor-not-allowed'
                    : 'bg-black/40 border-gray-800 text-gray-300 hover:bg-yellow-400/10 hover:border-yellow-600/50 hover:text-yellow-300 cursor-pointer active:scale-95'
                  }
                `}
              >
                <span className="text-[10px] opacity-60 mb-0.5 font-black">{option.key}</span>
                <span className="text-base font-black">{option.odds.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MERCADOS ADICIONALES (expandibles) ── */}
        {!isFinished && match.markets.length > 1 && (
          <>
            {/* Botón toggle para expandir/colapsar los mercados adicionales */}
            <button
              onClick={() => setExpanded(prev => !prev)}
              // prev => !prev: toggle del booleano
              className="mt-4 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-400 text-xs font-black uppercase tracking-widest transition-colors py-1"
            >
              {/* El texto cambia según expanded */}
              {expanded ? 'Ocultar mercados' : `+${match.markets.length - 1} mercados más`}
              {/* Flecha que rota 180° cuando está expandido — rotate-180 es clase de Tailwind */}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Panel de mercados adicionales — solo se renderiza si expanded === true */}
            {expanded && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-800 pt-4">
                {/* slice(1): saltamos el primer mercado (1X2) que ya se muestra arriba */}
                {match.markets.slice(1).map((market) => (
                  <div key={market.id} className="bg-black/30 border border-gray-800 rounded-xl p-3">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                      {market.label}
                    </p>
                    <div className={`grid gap-2 ${market.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {market.options.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => onBet(match.id, market.id, option.key)}
                          className="flex flex-col items-center py-2 px-1 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 hover:bg-yellow-400/10 hover:border-yellow-600/50 hover:text-yellow-300 transition-all duration-150 active:scale-95"
                        >
                          <span className="text-[9px] text-center opacity-60 mb-0.5 font-bold leading-tight">{option.label}</span>
                          <span className="text-sm font-black">{option.odds.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Mensaje para partidos finalizados */}
        {isFinished && (
          <p className="mt-3 text-center text-gray-700 text-xs font-bold uppercase tracking-widest">
            — Partido finalizado · Apuestas cerradas —
          </p>
        )}
      </div>
    </article>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: Partidos
// ─────────────────────────────────────────────────────────────────────────────
export default function Partidos() {
  const handleLogout = useLogout()

  // filter: qué estado de partido mostrar ('all' | 'live' | 'upcoming' | 'finished')
  const [filter, setFilter] = useState('all')

  // betTarget: { matchId, marketId, optionKey } | null
  // null = modal cerrado. Cuando tiene valor, el modal se abre con esa configuración
  const [betTarget, setBetTarget] = useState(null)

  // Hora actual simulada para el header
  const [currentTime, setCurrentTime] = useState(new Date())

  // useEffect: actualiza la hora cada minuto
  // El return dentro del useEffect es la función de cleanup — se ejecuta cuando el
  // componente se desmonta, para limpiar el intervalo y evitar memory leaks
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
    // clearInterval: detiene el intervalo cuando el componente deja de existir
  }, [])

  // handleBet: función que abre el modal pasando los IDs necesarios
  const handleBet = (matchId, marketId, optionKey) => {
    setBetTarget({ matchId, marketId, optionKey })
  }

  // handleCloseModal: cierra el modal reseteando betTarget a null
  const handleCloseModal = () => setBetTarget(null)

  // filteredMatches: filtramos TODAY_MATCHES según el filtro activo
  // filter === 'all': no filtramos nada, mostramos todos
  // Otros casos: filter() devuelve solo los partidos cuyo status coincide
  const filteredMatches = filter === 'all'
    ? TODAY_MATCHES
    : TODAY_MATCHES.filter(m => m.status === filter)

  // Contadores por estado — para los badges de los botones de filtro
  // filter(m => m.status === 'live').length: cuenta los partidos en vivo
  const counts = {
    all:      TODAY_MATCHES.length,
    live:     TODAY_MATCHES.filter(m => m.status === 'live').length,
    upcoming: TODAY_MATCHES.filter(m => m.status === 'upcoming').length,
    finished: TODAY_MATCHES.filter(m => m.status === 'finished').length,
  }

  // El partido que corresponde al betTarget activo (para pasarlo al modal)
  // find() busca en el array el partido cuyo id coincide con betTarget.matchId
  const activeBetMatch = betTarget
    ? TODAY_MATCHES.find(m => m.id === betTarget.matchId)
    : null

  // Agrupar partidos por hora para mostrarlos en bloques
  // reduce() construye un objeto donde cada clave es una hora y el valor es un array de partidos
  const matchesByTime = filteredMatches.reduce((acc, match) => {
    // acc: el acumulador (empieza como {})
    // match.time: la clave (ej: "15:00 ET")
    if (!acc[match.time]) acc[match.time] = []
    // Si aún no existe ese grupo horario, lo creamos como array vacío
    acc[match.time].push(match)
    return acc
    // Devolvemos el acumulador modificado para la siguiente iteración
  }, {})

  // Object.entries(): convierte el objeto a array de [clave, valor]
  // para poder hacer .map() sobre él
  const timeGroups = Object.entries(matchesByTime)

  return (
    <div
      className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
    >

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-yellow-400 text-xl">🏆</span>
            <div className="leading-none">
              <p className="text-white font-black text-lg tracking-tight">MUNDIAL<span className="text-yellow-400">BET</span></p>
              <p className="text-green-400 text-[9px] uppercase tracking-[0.25em] font-bold hidden sm:block">FIFA World Cup 2026</p>
            </div>
          </Link>

          {/* Título de la sección */}
          <div className="flex-1 text-center hidden md:block">
            <p className="text-white font-black text-base uppercase tracking-widest">Partidos del Día</p>
            <p className="text-gray-600 text-[10px]">
              {/* toLocaleDateString: formatea la fecha en español */}
              {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Badge EN VIVO con contador */}
            {counts.live > 0 && (
              <div className="flex items-center gap-1.5 bg-red-900/20 border border-red-900/40 rounded-full px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                <span className="text-red-400 text-xs font-black">{counts.live} EN VIVO</span>
              </div>
            )}
            <Link to="/Perfil" className="border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-black px-3 py-2 rounded-lg transition-all uppercase tracking-wide">
              Mi perfil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="border border-red-900/50 hover:border-red-700 bg-red-950/40 hover:bg-red-900/30 text-red-400 hover:text-red-300 text-xs font-black px-3 py-2 rounded-lg transition-all uppercase tracking-wide"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* ── HERO STRIP ── */}
        <section className="relative overflow-hidden rounded-2xl border border-yellow-900/30 bg-gray-900/40 p-5 sm:p-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-green-900/10 blur-[80px]" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/5 border border-yellow-500/20 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">Apuestas en tiempo real</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
                PARTIDOS DE HOY
                <span className="block text-xl sm:text-2xl text-yellow-400 mt-1">FIFA WORLD CUP 2026</span>
              </h1>
            </div>
            {/* Mini stats del día */}
            <div className="flex gap-3">
              {[
                { icon: '⚽', label: 'Partidos', val: counts.all },
                { icon: '📡', label: 'En vivo',  val: counts.live },
                { icon: '🕐', label: 'Próximos', val: counts.upcoming },
              ].map(({ icon, label, val }) => (
                <div key={label} className="text-center bg-black/40 border border-gray-800 rounded-xl px-3 py-2 min-w-[60px]">
                  <p className="text-lg">{icon}</p>
                  <p className="text-yellow-400 text-xl font-black leading-none">{val}</p>
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FILTROS ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'all',      label: 'Todos',      color: 'yellow' },
            { key: 'live',     label: '🔴 En Vivo',  color: 'red'    },
            { key: 'upcoming', label: '🕐 Próximos', color: 'green'  },
            { key: 'finished', label: '✅ Finalizados', color: 'gray' },
          ].map(({ key, label, color }) => {
            const isActive = filter === key
            // Mapa de colores para el botón activo según cada filtro
            const activeClass = {
              yellow: 'bg-yellow-400 border-yellow-400 text-black',
              red:    'bg-red-500 border-red-500 text-white',
              green:  'bg-green-500 border-green-500 text-black',
              gray:   'bg-gray-600 border-gray-600 text-white',
            }[color]

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest transition-all duration-200
                  ${isActive
                    ? activeClass
                    : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                  }
                `}
              >
                {label}
                {/* Contador entre paréntesis */}
                <span className={`text-[10px] ${isActive ? 'opacity-70' : 'text-gray-700'}`}>
                  ({counts[key]})
                </span>
              </button>
            )
          })}
        </div>

        {/* ── LISTA DE PARTIDOS AGRUPADOS POR HORA ── */}
        {timeGroups.length === 0
          ? (
            // Estado vacío — cuando el filtro no tiene resultados
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">⚽</span>
              <p className="text-white font-black text-xl mb-2">Sin partidos</p>
              <p className="text-gray-600 text-sm">No hay partidos con este filtro activo</p>
            </div>
          )
          : timeGroups.map(([time, matches]) => (
            // Bloque por hora
            <section key={time}>
              {/* Encabezado del bloque horario */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-full px-3 py-1">
                  <span className="text-yellow-400 text-xs">🕐</span>
                  <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">{time}</span>
                </div>
                {/* Línea horizontal que se extiende hasta el borde */}
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-gray-700 text-xs font-bold">{matches.length} {matches.length === 1 ? 'partido' : 'partidos'}</span>
              </div>

              {/* Grid de partidos de esa hora */}
              <div className="flex flex-col gap-3">
                {matches.map((match) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                    onBet={handleBet}
                  />
                ))}
              </div>
            </section>
          ))
        }
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-900 bg-black mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">&copy; 2026 MundialBet · Todos los derechos reservados</p>
          <p className="text-gray-700 text-xs font-bold">+18 · Juega responsablemente</p>
        </div>
      </footer>

      {/* ══ MODAL DE APUESTA ══ */}
      {/* Se renderiza solo cuando betTarget !== null Y encontramos el partido */}
      {betTarget && activeBetMatch && (
        <BetModal
          match={activeBetMatch}
          // Le pasamos los IDs del mercado y opción seleccionados para precargarlos
          initialOdds={{ marketId: betTarget.marketId, optionKey: betTarget.optionKey }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}