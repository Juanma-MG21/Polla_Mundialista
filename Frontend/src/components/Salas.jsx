import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FONT = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }

// TODO: reemplazar con fetch a GET /api/rooms
const MOCK_ROOMS = [
  { room_id: '1', room_name: 'La Polla del Barrio', access_code: 'WC26A1B2', member_count: 8, is_owner: true },
  { room_id: '2', room_name: 'Oficina FIFA', access_code: 'MUND1AL9', member_count: 14, is_owner: false },
  { room_id: '3', room_name: 'Familia García', access_code: 'GOL2026X', member_count: 5, is_owner: true },
]

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-yellow-400/20 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={FONT}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <h3 className="text-white font-bold text-lg uppercase tracking-wide">{title}</h3>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function RoomCard({ room, onOpen }) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 flex flex-col gap-4 hover:border-yellow-400/20 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-white font-bold text-lg uppercase tracking-tight">{room.room_name}</h3>
          {room.is_owner && (
            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-widest text-[#02B906] bg-[#02B906]/10 border border-[#02B906]/30 px-2 py-0.5 rounded">
              Propietario
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/60 text-[10px] uppercase tracking-wider">Código</p>
          <p className="text-[#FFDB00] font-bold text-sm tracking-widest">{room.access_code}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{room.member_count} miembros</span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(room.room_id)}
          className="bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-xs uppercase px-4 py-2 rounded-xl transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function Salas() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState(MOCK_ROOMS)
  const [modalCreate, setModalCreate] = useState(false)
  const [modalJoin, setModalJoin] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(null)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!roomName.trim()) {
      setError('Ingresa un nombre para la sala')
      return
    }
    // TODO: reemplazar con fetch a POST /api/rooms — body: { room_name }
    const newRoom = {
      room_id: String(Date.now()),
      room_name: roomName.trim(),
      access_code: generateAccessCode(),
      member_count: 1,
      is_owner: true,
    }
    setRooms((prev) => [newRoom, ...prev])
    setRoomName('')
    setError(null)
    setModalCreate(false)
  }

  const handleJoin = (e) => {
    e.preventDefault()
    const code = accessCode.trim().toUpperCase()
    if (!code) {
      setError('Ingresa el código de acceso')
      return
    }
    // TODO: reemplazar con fetch a POST /api/rooms/join — body: { access_code }
    const found = rooms.find((r) => r.access_code === code)
    if (!found) {
      setError('Código inválido o sala no encontrada')
      return
    }
    setAccessCode('')
    setError(null)
    setModalJoin(false)
    navigate(`/salas/${found.room_id}`)
  }

  const openRoom = (roomId) => navigate(`/salas/${roomId}`)

  return (
    <div className="min-h-screen bg-black text-white" style={FONT}>
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-400/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#FFDB00] text-xl">🏆</span>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight">
                MUNDIAL<span className="text-[#FFDB00]">BET</span>
              </h1>
              <p className="text-[#02B906] text-[9px] font-bold tracking-[0.3em] uppercase">Mis Salas</p>
            </div>
          </div>
          <Link to="/Partidos" className="border border-white/10 hover:border-yellow-400/20 text-white/60 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition-all uppercase">
            ← Volver
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#02B906]/5 blur-[120px] rounded-full" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-[#FFDB00]/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">Salas Privadas</h2>
              <p className="text-white/60 text-sm mt-1">Compite con amigos en tu liga mundialista</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setError(null); setModalJoin(true) }}
                className="border border-white/10 hover:border-yellow-400/20 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors"
              >
                Unirse
              </button>
              <button
                type="button"
                onClick={() => { setError(null); setModalCreate(true) }}
                className="bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors"
              >
                + Crear sala
              </button>
            </div>
          </div>

          {error && !modalCreate && !modalJoin && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.length === 0 ? (
              <div className="col-span-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-12 text-center text-white/60">
                No tienes salas aún. Crea una o únete con un código.
              </div>
            ) : (
              rooms.map((room) => (
                <RoomCard key={room.room_id} room={room} onOpen={openRoom} />
              ))
            )}
          </div>
        </div>
      </main>

      {modalCreate && (
        <Modal title="Crear sala" onClose={() => { setModalCreate(false); setError(null) }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">Nombre de la sala</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Ej: La Polla del Barrio"
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-yellow-400/20 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-sm uppercase py-2.5 rounded-xl transition-colors">
              Crear sala
            </button>
          </form>
        </Modal>
      )}

      {modalJoin && (
        <Modal title="Unirse a sala" onClose={() => { setModalJoin(false); setError(null) }}>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">Código de acceso</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="WC26A1B2"
                maxLength={8}
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-yellow-400/20 rounded-xl px-4 py-2.5 text-white text-sm outline-none tracking-widest uppercase transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
            <button type="submit" className="w-full bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-sm uppercase py-2.5 rounded-xl transition-colors">
              Unirse
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
