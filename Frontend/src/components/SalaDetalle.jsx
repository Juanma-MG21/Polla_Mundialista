import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const FONT = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }

const TABS = [
  { id: 'members', label: 'Miembros' },
  { id: 'chat', label: 'Chat' },
  { id: 'polls', label: 'Encuestas' },
  { id: 'tickets', label: 'Tickets' },
]

// TODO: reemplazar con fetch a GET /api/rooms/:roomId
const MOCK_ROOM = {
  room_id: '1',
  room_name: 'La Polla del Barrio',
  access_code: 'WC26A1B2',
  owner_username: 'admin_mundial',
}

// TODO: reemplazar con fetch a GET /api/rooms/:roomId/members
const MOCK_MEMBERS = [
  { user_id: '1', username: 'admin_mundial', first_name: 'Carlos', role: 'OWNER' },
  { user_id: '2', username: 'juan_m92', first_name: 'Juan', role: 'MEMBER' },
  { user_id: '3', username: 'sofia_wc26', first_name: 'Sofía', role: 'MEMBER' },
  { user_id: '4', username: 'pedro_gol', first_name: 'Pedro', role: 'MEMBER' },
  { user_id: '5', username: 'ana_futbol', first_name: 'Ana', role: 'MEMBER' },
]

// TODO: reemplazar con fetch a GET /api/chat/room/:roomId
const MOCK_MESSAGES = [
  { message_id: '1', username: 'juan_m92', message_text: '¿Quién va con Brasil hoy?', created_at: '14:32' },
  { message_id: '2', username: 'sofia_wc26', message_text: 'Yo apuesto empate en el segundo tiempo', created_at: '14:35' },
  { message_id: '3', username: 'admin_mundial', message_text: 'Recuerden crear su ticket antes de las 15:00', created_at: '14:40' },
]

// TODO: reemplazar con fetch a GET /api/polls/room/:roomId
const MOCK_POLLS = [
  {
    poll_id: '1',
    title: '¿Quién gana Brasil vs Marruecos?',
    status: 'OPEN',
    options: [
      { option_id: '1', label: '🇧🇷 Brasil', votes: 5 },
      { option_id: '2', label: 'Empate', votes: 2 },
      { option_id: '3', label: '🇲🇦 Marruecos', votes: 1 },
    ],
    user_voted_option_id: null,
  },
  {
    poll_id: '2',
    title: '¿Habrá más de 2.5 goles en Alemania vs Ecuador?',
    status: 'OPEN',
    options: [
      { option_id: '4', label: 'Sí', votes: 6 },
      { option_id: '5', label: 'No', votes: 3 },
    ],
    user_voted_option_id: null,
  },
]

// TODO: reemplazar con fetch a GET /api/tickets/room/:roomId
const MOCK_TICKETS = [
  { ticket_id: '101', username: 'juan_m92', match_label: 'Brasil vs Marruecos', status: 'OPEN', created_at: '12 Jun' },
  { ticket_id: '102', username: 'sofia_wc26', match_label: 'Alemania vs Ecuador', status: 'CLOSED', created_at: '11 Jun' },
  { ticket_id: '103', username: 'pedro_gol', match_label: 'México vs Sudáfrica', status: 'RESOLVED', created_at: '10 Jun' },
]

function Avatar({ name }) {
  const initial = (name || 'U')[0].toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-[#FFDB00]/20 border border-[#FFDB00]/40 flex items-center justify-center text-[#FFDB00] font-bold text-sm shrink-0">
      {initial}
    </div>
  )
}

function TicketStatus({ status }) {
  const styles = {
    OPEN: 'bg-[#02B906]/10 border-[#02B906]/30 text-[#02B906]',
    CLOSED: 'bg-white/5 border-white/10 text-white/60',
    RESOLVED: 'bg-[#FFDB00]/10 border-[#FFDB00]/30 text-[#FFDB00]',
  }
  const labels = { OPEN: 'Abierto', CLOSED: 'Cerrado', RESOLVED: 'Resuelto' }
  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${styles[status] || styles.CLOSED}`}>
      {labels[status] || status}
    </span>
  )
}

function TabMembers({ members }) {
  return (
    <div className="space-y-2">
      {members.map((m) => (
        <div key={m.user_id} className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
          <Avatar name={m.first_name || m.username} />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{m.first_name || m.username}</p>
            <p className="text-white/60 text-xs truncate">@{m.username}</p>
          </div>
          {m.role === 'OWNER' && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFDB00] border border-[#FFDB00]/30 bg-[#FFDB00]/10 px-2 py-0.5 rounded">
              Owner
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function TabChat({ messages, onSend }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="flex flex-col h-[420px]">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
        {messages.map((msg) => (
          <div key={msg.message_id} className="flex gap-3">
            <Avatar name={msg.username} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[#FFDB00] font-bold text-xs">@{msg.username}</span>
                <span className="text-white/40 text-[10px]">{msg.created_at}</span>
              </div>
              <p className="text-white/80 text-sm mt-0.5">{msg.message_text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 pt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-[#1a1a1a] border border-white/10 focus:border-yellow-400/20 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
        />
        <button type="submit" className="bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors shrink-0">
          Enviar
        </button>
      </form>
    </div>
  )
}

function TabPolls({ polls, onVote }) {
  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div key={poll.poll_id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-start gap-2 mb-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-tight">{poll.title}</h4>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${
              poll.status === 'OPEN'
                ? 'bg-[#02B906]/10 border-[#02B906]/30 text-[#02B906]'
                : 'bg-white/5 border-white/10 text-white/60'
            }`}>
              {poll.status}
            </span>
          </div>
          <div className="space-y-2">
            {poll.options.map((opt) => {
              const total = poll.options.reduce((s, o) => s + o.votes, 0)
              const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0
              const voted = poll.user_voted_option_id === opt.option_id
              return (
                <button
                  key={opt.option_id}
                  type="button"
                  disabled={poll.user_voted_option_id !== null}
                  onClick={() => onVote(poll.poll_id, opt.option_id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                    voted
                      ? 'border-[#FFDB00]/40 bg-[#FFDB00]/10'
                      : 'border-white/10 bg-[#1a1a1a] hover:border-yellow-400/20 disabled:opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm font-bold">{opt.label}</span>
                    <span className="text-white/60 text-xs">{opt.votes} votos · {pct}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFDB00] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function TabTickets({ tickets, roomId }) {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/salas/${roomId}/ticket`)}
          className="bg-[#FFDB00] hover:bg-[#FFDB00]/90 text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors"
        >
          + Crear ticket
        </button>
      </div>
      {tickets.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-white/60 text-sm">
          No hay tickets en esta sala aún.
        </div>
      ) : (
        tickets.map((t) => (
          <div key={t.ticket_id} className="flex items-center justify-between gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{t.match_label}</p>
              <p className="text-white/60 text-xs">@{t.username} · {t.created_at}</p>
            </div>
            <TicketStatus status={t.status} />
          </div>
        ))
      )}
    </div>
  )
}

export default function SalaDetalle() {
  const { roomId } = useParams()
  const [activeTab, setActiveTab] = useState('members')
  const [room] = useState({ ...MOCK_ROOM, room_id: roomId || MOCK_ROOM.room_id })
  const [members] = useState(MOCK_MEMBERS)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [polls, setPolls] = useState(MOCK_POLLS)
  const [tickets] = useState(MOCK_TICKETS)

  const handleSendMessage = (text) => {
    // TODO: reemplazar con fetch a POST /api/chat/room/:roomId — body: { content }
    setMessages((prev) => [
      ...prev,
      {
        message_id: String(Date.now()),
        username: 'tu_usuario',
        message_text: text,
        created_at: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  const handleVote = (pollId, optionId) => {
    // TODO: reemplazar con fetch a POST /api/polls/:pollId/vote — body: { option_id }
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.poll_id !== pollId) return poll
        return {
          ...poll,
          user_voted_option_id: optionId,
          options: poll.options.map((opt) =>
            opt.option_id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        }
      })
    )
  }

  return (
    <div className="min-h-screen bg-black text-white" style={FONT}>
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-yellow-400/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <Link to="/salas" className="text-white/60 hover:text-white text-xs font-bold uppercase transition-colors">
              ← Salas
            </Link>
            <span className="text-[#02B906] text-[9px] font-bold uppercase tracking-[0.3em]">Sala activa</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">{room.room_name}</h1>
              <p className="text-white/60 text-sm mt-0.5">
                Código: <span className="text-[#FFDB00] font-bold tracking-widest">{room.access_code}</span>
                {' · '}Owner: <span className="text-white">@{room.owner_username}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              </svg>
              {members.length} miembros
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 mb-6 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#FFDB00] text-black'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 sm:p-6">
          {activeTab === 'members' && <TabMembers members={members} />}
          {activeTab === 'chat' && <TabChat messages={messages} onSend={handleSendMessage} />}
          {activeTab === 'polls' && <TabPolls polls={polls} onVote={handleVote} />}
          {activeTab === 'tickets' && <TabTickets tickets={tickets} roomId={room.room_id} />}
        </div>
      </main>
    </div>
  )
}
