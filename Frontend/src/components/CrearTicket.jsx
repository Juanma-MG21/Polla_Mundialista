import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const FONT = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }

// TODO: reemplazar con fetch a GET /api/matches/upcoming
const MOCK_UPCOMING_MATCHES = [
  {
    match_id: '4',
    label: '🇩🇪 Alemania vs 🇪🇨 Ecuador',
    datetime: '18:00 ET · 15 Jun',
    group: 'Grupo E',
    markets: [
      {
        market_id: 'm1',
        label: 'Resultado Final (1X2)',
        options: [
          { option_id: 'o1', label: '🇩🇪 Alemania', odds: 1.65 },
          { option_id: 'o2', label: 'Empate', odds: 3.60 },
          { option_id: 'o3', label: '🇪🇨 Ecuador', odds: 5.20 },
        ],
      },
      {
        market_id: 'm2',
        label: 'Ambos equipos anotan',
        options: [
          { option_id: 'o4', label: 'Sí', odds: 1.80 },
          { option_id: 'o5', label: 'No', odds: 2.00 },
        ],
      },
      {
        market_id: 'm3',
        label: 'Total de goles',
        options: [
          { option_id: 'o6', label: 'Más de 2.5', odds: 1.90 },
          { option_id: 'o7', label: 'Menos de 2.5', odds: 1.85 },
        ],
      },
    ],
  },
  {
    match_id: '5',
    label: '🇫🇷 Francia vs 🇳🇱 Países Bajos',
    datetime: '21:00 ET · 15 Jun',
    group: 'Grupo F',
    markets: [
      {
        market_id: 'm4',
        label: 'Resultado Final (1X2)',
        options: [
          { option_id: 'o8', label: '🇫🇷 Francia', odds: 1.55 },
          { option_id: 'o9', label: 'Empate', odds: 3.80 },
          { option_id: 'o10', label: '🇳🇱 Países Bajos', odds: 5.50 },
        ],
      },
      {
        market_id: 'm5',
        label: 'Total de goles',
        options: [
          { option_id: 'o11', label: 'Más de 2.5', odds: 1.75 },
          { option_id: 'o12', label: 'Menos de 2.5', odds: 2.05 },
        ],
      },
    ],
  },
  {
    match_id: '6',
    label: '🇦🇷 Argentina vs 🇨🇱 Chile',
    datetime: '15:00 ET · 16 Jun',
    group: 'Grupo G',
    markets: [
      {
        market_id: 'm6',
        label: 'Resultado Final (1X2)',
        options: [
          { option_id: 'o13', label: '🇦🇷 Argentina', odds: 1.45 },
          { option_id: 'o14', label: 'Empate', odds: 4.00 },
          { option_id: 'o15', label: '🇨🇱 Chile', odds: 7.00 },
        ],
      },
    ],
  },
]

function MarketSelector({ market, selectedOptionId, onSelect }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">{market.label}</p>
      <div className={`grid gap-2 ${market.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {market.options.map((opt) => (
          <button
            key={opt.option_id}
            type="button"
            onClick={() => onSelect(market.market_id, opt)}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all ${
              selectedOptionId === opt.option_id
                ? 'bg-[#FFDB00] border-[#FFDB00] text-black'
                : 'bg-white/5 border-white/10 text-white hover:border-yellow-400/20'
            }`}
          >
            <span className="text-[10px] font-bold text-center leading-tight mb-1">{opt.label}</span>
            <span className={`text-sm font-bold ${selectedOptionId === opt.option_id ? 'text-black' : 'text-[#FFDB00]'}`}>
              {opt.odds.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CrearTicket() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [matches] = useState(MOCK_UPCOMING_MATCHES)
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [selections, setSelections] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)

  const selectedMatch = matches.find((m) => m.match_id === selectedMatchId)

  const handleMatchChange = (matchId) => {
    setSelectedMatchId(matchId)
    setSelections({})
    setError(null)
    setConfirmed(false)
  }

  const handleSelectOption = (marketId, option) => {
    setSelections((prev) => ({
      ...prev,
      [marketId]: { option_id: option.option_id, label: option.label, odds: option.odds },
    }))
    setError(null)
  }

  const allMarketsSelected = selectedMatch
    ? selectedMatch.markets.every((m) => selections[m.market_id])
    : false

  const handleConfirm = () => {
    if (!selectedMatch) {
      setError('Selecciona un partido')
      return
    }
    if (!allMarketsSelected) {
      setError('Completa una predicción en cada mercado')
      return
    }
    // TODO: reemplazar con fetch a POST /api/tickets/room/:roomId
    setConfirmed(true)
    setError(null)
  }

  const summaryItems = selectedMatch
    ? selectedMatch.markets
        .filter((m) => selections[m.market_id])
        .map((m) => ({
          market: m.label,
          pick: selections[m.market_id].label,
          odds: selections[m.market_id].odds,
        }))
    : []

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4" style={FONT}>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#02B906]/20 border-2 border-[#02B906] flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h2 className="text-2xl font-bold uppercase mb-2">Ticket creado</h2>
          <p className="text-white/60 text-sm mb-6">
            Tu ticket para <span className="text-white font-bold">{selectedMatch?.label}</span> fue registrado en la sala.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/salas/${roomId}`)}
            className="w-full bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-sm uppercase py-3 rounded-xl transition-colors"
          >
            Volver a la sala
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={FONT}>
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-yellow-400/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={`/salas/${roomId}`} className="text-white/60 hover:text-white text-xs font-bold uppercase transition-colors">
            ← Volver a la sala
          </Link>
          <span className="text-[#FFDB00] text-[9px] font-bold uppercase tracking-[0.3em]">Nuevo ticket</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">Crear ticket</h1>
          <p className="text-white/60 text-sm mt-1">Selecciona un partido y define tus predicciones</p>
        </div>

        <section className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <label className="block text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Partido</label>
          <select
            value={selectedMatchId}
            onChange={(e) => handleMatchChange(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 focus:border-yellow-400/20 rounded-xl px-4 py-3 text-white text-sm outline-none appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23ffffff99\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
          >
            <option value="" className="bg-[#1a1a1a]">Selecciona un partido...</option>
            {matches.map((m) => (
              <option key={m.match_id} value={m.match_id} className="bg-[#1a1a1a]">
                {m.label} — {m.datetime}
              </option>
            ))}
          </select>
          {selectedMatch && (
            <p className="text-[#02B906] text-[10px] font-bold uppercase tracking-widest mt-2">{selectedMatch.group}</p>
          )}
        </section>

        {selectedMatch && (
          <>
            <section className="space-y-4">
              <h2 className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Mercados disponibles</h2>
              {/* TODO: reemplazar con fetch a GET /api/markets/match/:matchId */}
              {selectedMatch.markets.map((market) => (
                <MarketSelector
                  key={market.market_id}
                  market={market}
                  selectedOptionId={selections[market.market_id]?.option_id}
                  onSelect={handleSelectOption}
                />
              ))}
            </section>

            {summaryItems.length > 0 && (
              <section className="bg-white/5 backdrop-blur border border-yellow-400/20 rounded-2xl p-5">
                <h2 className="text-[#FFDB00] text-[10px] font-bold uppercase tracking-widest mb-4">Resumen del ticket</h2>
                <div className="space-y-3 mb-4">
                  <div className="border-b border-white/10 pb-2">
                    <p className="text-white/60 text-xs">Partido</p>
                    <p className="text-white font-bold">{selectedMatch.label}</p>
                  </div>
                  {summaryItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <div>
                        <p className="text-white/60 text-[10px] uppercase">{item.market}</p>
                        <p className="text-white font-bold text-sm">{item.pick}</p>
                      </div>
                      <span className="text-[#FFDB00] font-bold">{item.odds.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-400 text-xs font-bold mb-3">{error}</p>}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!allMarketsSelected}
                  className="w-full bg-[#FFDB00] hover:bg-[#FFDB00]/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-sm uppercase py-3 rounded-xl transition-colors"
                >
                  Confirmar ticket
                </button>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
