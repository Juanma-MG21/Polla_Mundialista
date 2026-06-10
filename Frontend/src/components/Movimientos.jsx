import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../utils/time'

const API_BASE = 'http://localhost:3000/api'
const FONT = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }

function StatusBadge({ status }) {
  const styles = {
    WON: 'bg-green-500/10 border-green-500/30 text-green-400',
    LOST: 'bg-red-500/10 border-red-500/30 text-red-400',
    PENDING: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  }
  const labels = { WON: 'Ganada', LOST: 'Perdida', PENDING: 'Pendiente' }
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  )
}

export default function Movimientos() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchMovements = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Debes iniciar sesión como administrador')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/movements?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (data.success) {
          setMovements(data.data || [])
        } else {
          setError(data.message || 'No se pudieron cargar los movimientos')
        }
      } catch {
        setError('Error de conexión con el servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchMovements()
  }, [])

  const filtered = movements.filter((m) => {
    if (filter === 'all') return true
    if (filter === 'won') return m.status === 'WON'
    if (filter === 'lost') return m.status === 'LOST'
    return m.status === 'PENDING'
  })

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={FONT}>
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🏆</span>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none mt-1">
                Registro de Movimientos
              </span>
            </h1>
          </div>
          <Link
            to="/Dashboard"
            className="border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-black px-4 py-2 rounded-xl transition-all uppercase tracking-wide"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Movimientos</h2>
            <p className="text-gray-500 text-xs mt-1">Historial de apuestas y registros de todos los usuarios</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-900/80 border border-gray-800 rounded-xl p-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'won', label: 'Ganadas' },
              { id: 'lost', label: 'Perdidas' },
              { id: 'pending', label: 'Pendientes' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === tab.id ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-9 h-9 border-4 border-t-yellow-400 border-gray-800 rounded-full animate-spin" />
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Cargando movimientos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
            No hay movimientos registrados en esta categoría.
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_1fr_120px_100px_100px] gap-4 px-6 py-3 border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <span>Usuario</span>
              <span>Detalle</span>
              <span>Sala</span>
              <span>Puntos</span>
              <span>Estado</span>
            </div>
            <div className="divide-y divide-gray-800/60">
              {filtered.map((m) => (
                <div
                  key={m.movement_id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-900/40 transition-colors grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_100px_100px] gap-3 md:gap-4 md:items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-yellow-400 font-black text-sm shrink-0">
                      {(m.user_name || m.user || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{m.user_name || m.user}</p>
                      <p className="text-gray-500 text-xs truncate">@{m.user}</p>
                      <p className="text-gray-600 text-[10px] md:hidden">{formatRelativeTime(m.created_at)}</p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">{m.match_label}</p>
                    <p className="text-gray-500 text-xs truncate">{m.market_label}</p>
                    <p className="text-gray-600 text-[10px] hidden md:block">{formatRelativeTime(m.created_at)}</p>
                  </div>
                  <p className="text-gray-400 text-xs truncate">{m.room_name || '—'}</p>
                  <p className={`font-black text-sm ${m.win ? 'text-green-400' : 'text-yellow-400'}`}>{m.amount}</p>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
