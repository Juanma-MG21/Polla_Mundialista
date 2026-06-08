import { useNavigate } from 'react-router-dom'

const WORLD_CUP_GROUPS = [
  {
    group: 'A',
    title: 'Grupo A',
    teams: [
      { flag: '🇲🇽', name: 'México', tag: 'Anfitrión' },
      { flag: '🇿🇦', name: 'Sudáfrica', tag: 'CAF' },
      { flag: '🇰🇷', name: 'Corea del Sur', tag: 'AFC' },
      { flag: '🇨🇿', name: 'Chequia', tag: 'UEFA' },
    ],
  },
  {
    group: 'B',
    title: 'Grupo B',
    teams: [
      { flag: '🇨🇦', name: 'Canadá', tag: 'Anfitrión' },
      { flag: '🇨🇭', name: 'Suiza', tag: 'UEFA' },
      { flag: '🇶🇦', name: 'Qatar', tag: 'AFC' },
      { flag: '🇧🇦', name: 'Bosnia y Herzegovina', tag: 'UEFA' },
    ],
  },
  {
    group: 'C',
    title: 'Grupo C',
    teams: [
      { flag: '🇧🇷', name: 'Brasil', tag: 'CONMEBOL' },
      { flag: '🇲🇦', name: 'Marruecos', tag: 'CAF' },
      { flag: '🇭🇹', name: 'Haití', tag: 'Concacaf' },
      { flag: '🏴', name: 'Escocia', tag: 'UEFA' },
    ],
  },
  {
    group: 'D',
    title: 'Grupo D',
    teams: [
      { flag: '🇺🇸', name: 'Estados Unidos', tag: 'Anfitrión' },
      { flag: '🇵🇾', name: 'Paraguay', tag: 'CONMEBOL' },
      { flag: '🇦🇺', name: 'Australia', tag: 'AFC' },
      { flag: '🇹🇷', name: 'Turquía', tag: 'UEFA' },
    ],
  },
  {
    group: 'E',
    title: 'Grupo E',
    teams: [
      { flag: '🇩🇪', name: 'Alemania', tag: 'UEFA' },
      { flag: '🇨🇼', name: 'Curazao', tag: 'Concacaf' },
      { flag: '🇨🇮', name: 'Costa de Marfil', tag: 'CAF' },
      { flag: '🇪🇨', name: 'Ecuador', tag: 'CONMEBOL' },
    ],
  },
  {
    group: 'F',
    title: 'Grupo F',
    teams: [
      { flag: '🇳🇱', name: 'Países Bajos', tag: 'UEFA' },
      { flag: '🇯🇵', name: 'Japón', tag: 'AFC' },
      { flag: '🇹🇳', name: 'Túnez', tag: 'CAF' },
      { flag: '🇸🇪', name: 'Suecia', tag: 'UEFA' },
    ],
  },
  {
    group: 'G',
    title: 'Grupo G',
    teams: [
      { flag: '🇧🇪', name: 'Bélgica', tag: 'UEFA' },
      { flag: '🇪🇬', name: 'Egipto', tag: 'CAF' },
      { flag: '🇮🇷', name: 'Irán', tag: 'AFC' },
      { flag: '🇳🇿', name: 'Nueva Zelanda', tag: 'OFC' },
    ],
  },
  {
    group: 'H',
    title: 'Grupo H',
    teams: [
      { flag: '🇪🇸', name: 'España', tag: 'UEFA' },
      { flag: '🇨🇻', name: 'Cabo Verde', tag: 'CAF' },
      { flag: '🇸🇦', name: 'Arabia Saudita', tag: 'AFC' },
      { flag: '🇺🇾', name: 'Uruguay', tag: 'CONMEBOL' },
    ],
  },
  {
    group: 'I',
    title: 'Grupo I',
    teams: [
      { flag: '🇫🇷', name: 'Francia', tag: 'UEFA' },
      { flag: '🇸🇳', name: 'Senegal', tag: 'CAF' },
      { flag: '🇳🇴', name: 'Noruega', tag: 'UEFA' },
      { flag: '🇮🇶', name: 'Irak', tag: 'AFC' },
    ],
  },
  {
    group: 'J',
    title: 'Grupo J',
    teams: [
      { flag: '🇦🇷', name: 'Argentina', tag: 'CONMEBOL' },
      { flag: '🇩🇿', name: 'Argelia', tag: 'CAF' },
      { flag: '🇦🇹', name: 'Austria', tag: 'UEFA' },
      { flag: '🇯🇴', name: 'Jordania', tag: 'AFC' },
    ],
  },
  {
    group: 'K',
    title: 'Grupo K',
    teams: [
      { flag: '🇵🇹', name: 'Portugal', tag: 'UEFA' },
      { flag: '🇺🇿', name: 'Uzbekistán', tag: 'AFC' },
      { flag: '🇨🇴', name: 'Colombia', tag: 'CONMEBOL' },
      { flag: '🇨🇩', name: 'RD Congo', tag: 'CAF' },
    ],
  },
  {
    group: 'L',
    title: 'Grupo L',
    teams: [
      { flag: '🏴', name: 'Inglaterra', tag: 'UEFA' },
      { flag: '🇭🇷', name: 'Croacia', tag: 'UEFA' },
      { flag: '🇬🇭', name: 'Ghana', tag: 'CAF' },
      { flag: '🇵🇦', name: 'Panamá', tag: 'Concacaf' },
    ],
  },
]

const statCards = [
  { label: 'Grupos', value: '12', icon: '🏆' },
  { label: 'Selecciones', value: '48', icon: '🌎' },
  { label: 'Anfitriones', value: '3', icon: '⭐' },
]

const GroupsWorldCup = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-[#080808] text-white overflow-x-hidden"
      style={{ fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif" }}
    >
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-yellow-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-green-700 hover:border-green-500 text-green-400 hover:text-green-300 font-bold text-sm px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wide"
          >
            ← Regresar
          </button>

          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">🏆</span>
            <span className="text-white font-black text-xl tracking-tight leading-none">
              MUNDIAL<span className="text-yellow-400">BET</span>
              <span className="block text-[9px] text-green-400 font-bold tracking-[0.3em] uppercase leading-none">
                FIFA World Cup 2026
              </span>
            </span>
          </div>
        </div>
      </header>

      <hr className="my-1 border-none h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <section className="relative overflow-hidden rounded-2xl border border-yellow-900/40 bg-gray-900/60 p-6 sm:p-8">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-green-900/15 blur-[120px] rounded-full" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/8 blur-3xl rounded-full" />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-400/5 rounded-full px-4 py-1.5 mb-5">
                <span className="text-yellow-400 text-sm">🏆</span>
                <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em]">
                  FIFA World Cup 2026
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black leading-none tracking-tight">
                <span className="block text-white">GRUPOS DEL</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                  MUNDIAL
                </span>
              </h2>

              <p className="text-gray-400 text-base max-w-xl mt-4 leading-relaxed">
                Consulta los 12 grupos oficiales con las 48 selecciones clasificadas al Mundial 2026.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[92px] rounded-xl border border-gray-800 bg-black/50 px-4 py-3 text-center"
                >
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className="text-yellow-400 text-2xl font-black">{stat.value}</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full rounded-2xl border border-gray-800 bg-gray-900/50 p-6 shadow-xl shadow-yellow-900/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide flex items-center gap-3">
              <span className="w-1 h-8 bg-green-500 rounded-full" />
              Fase de Grupos
            </h3>

            <span className="hidden sm:inline-block text-yellow-400 text-sm font-black uppercase tracking-wider">
              A - L
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WORLD_CUP_GROUPS.map((group) => (
              <article
                key={group.group}
                className="relative group bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-yellow-600/40 hover:shadow-xl hover:shadow-yellow-900/10"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="bg-green-900/40 border-b border-green-900/60 px-4 py-3 flex items-center justify-between">
                  <span className="text-green-400 text-xs font-black uppercase tracking-widest">
                    {group.title}
                  </span>

                  <span className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black shadow-lg shadow-yellow-900/30">
                    {group.group}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-2.5">
                  {group.teams.map((team) => (
                    <div
                      key={team.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-black/40 px-3 py-2.5 transition-colors duration-200 hover:bg-black/60 hover:border-yellow-600/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{team.flag}</span>
                        <p className="text-white font-bold text-sm truncate">
                          {team.name}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-green-900/50 bg-green-900/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-green-400">
                        {team.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-700 text-xs">
            © 2026 <strong className="text-yellow-400">MundialBet</strong>. Vista visual de grupos.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default GroupsWorldCup