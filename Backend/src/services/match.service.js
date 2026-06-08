const prisma = require("../config/prisma");

class MatchService {
    /**
     * Registra un nuevo partido programado entre dos equipos diferentes.
     * @param {Object} matchData - Datos del partido.
     */
    async createMatch(matchData) {
        const {
            home_team_id,
            away_team_id,
            kickoff_at,
            venue,
            competition
        } = matchData;

        if (!home_team_id || !away_team_id) {
            throw new Error("Ambos equipos (local y visitante) son obligatorios");
        }

        if (Number(home_team_id) === Number(away_team_id)) {
            throw new Error("Un equipo no puede jugar contra sí mismo");
        }

        return await prisma.matches.create({
            data: {
                home_team_id: Number(home_team_id),
                away_team_id: Number(away_team_id),
                kickoff_at: kickoff_at ? new Date(kickoff_at) : new Date(),
                venue: venue ? venue.trim() : null,
                competition: competition ? competition.trim() : null,
                status: "SCHEDULED"
            }
        });
    }

    /**
     * Obtiene los detalles de un partido específico incluyendo los datos de los equipos.
     * @param {number|string} matchId - ID del partido.
     */
    async getMatch(matchId) {
        return await prisma.matches.findUnique({
            where: {
                match_id: Number(matchId)
            },
            include: {
                home_team: true, // Asegúrate de que coincida con la relación de tu schema.prisma
                away_team: true
            }
        });
    }

    /**
     * Obtiene todos los partidos históricos y agendados organizados cronológicamente.
     */
    async getAllMatches() {
        return await prisma.matches.findMany({
            include: {
                home_team: true,
                away_team: true
            },
            orderBy: {
                kickoff_at: "asc"
            }
        });
    }

    /**
     * Obtiene el listado de los próximos partidos con estado programado (SCHEDULED).
     */
    async getUpcomingMatches() {
        return await prisma.matches.findMany({
            where: {
                status: "SCHEDULED"
            },
            include: {
                home_team: true,
                away_team: true
            },
            orderBy: {
                kickoff_at: "asc"
            }
        });
    }

    /**
     * Actualiza el marcador (goles) de un partido en juego o finalizado.
     */
    async updateScore(matchId, homeGoals, awayGoals) {
        // Validación de existencia previa
        const match = await prisma.matches.findUnique({
            where: { match_id: Number(matchId) }
        });

        if (!match) throw new Error("Partido no encontrado");

        return await prisma.matches.update({
            where: {
                match_id: Number(matchId)
            },
            data: {
                home_score: homeGoals !== undefined && homeGoals !== null ? Number(homeGoals) : null,
                away_score: awayGoals !== undefined && awayGoals !== null ? Number(awayGoals) : null
            }
        });
    }

    /**
     * Actualiza el estado actual del juego (LIVE, FINISHED, POSTPONED, etc.).
     */
    async updateStatus(matchId, status) {
        const match = await prisma.matches.findUnique({
            where: { match_id: Number(matchId) }
        });

        if (!match) throw new Error("Partido no encontrado");

        if (!status || !status.trim()) throw new Error("El estado es obligatorio");

        return await prisma.matches.update({
            where: {
                match_id: Number(matchId)
            },
            data: {
                status: status.trim().toUpperCase()
            }
        });
    }

    /**
     * Obtiene el historial de enfrentamientos directos entre dos equipos (Head-to-Head).
     */
    async getHeadToHead(teamA, teamB) {
        return await prisma.matches.findMany({
            where: {
                OR: [
                    {
                        home_team_id: Number(teamA),
                        away_team_id: Number(teamB)
                    },
                    {
                        home_team_id: Number(teamB),
                        away_team_id: Number(teamA)
                    }
                ]
            },
            include: {
                home_team: true,
                away_team: true
            },
            orderBy: {
                kickoff_at: "desc" // Los más recientes primero
            }
        });
    }
}

module.exports = new MatchService();