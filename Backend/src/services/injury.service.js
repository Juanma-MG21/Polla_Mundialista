const prisma = require("../config/prisma");

class InjuryService {
    async getActiveInjuriesByTeam(teamId) {
        return prisma.injuries.findMany({
            where: {
                is_active: true,
                players: {
                    team_id: BigInt(teamId)
                }
            },
            include: {
                players: true
            },
            orderBy: {
                start_date: "desc"
            }
        });
    }

    async createInjury(injuryData) {
        if (!injuryData.player_id) {
            throw new Error("El ID del jugador es obligatorio");
        }
        if (!injuryData.injury_description?.trim()) {
            throw new Error("La descripción de la lesión es obligatoria");
        }
        if (!injuryData.start_date) {
            throw new Error("La fecha de inicio es obligatoria");
        }

        const player = await prisma.players.findUnique({
            where: { player_id: BigInt(injuryData.player_id) }
        });

        if (!player) {
            throw new Error("Jugador no encontrado");
        }

        return prisma.injuries.create({
            data: {
                player_id: BigInt(injuryData.player_id),
                injury_description: injuryData.injury_description.trim(),
                start_date: new Date(injuryData.start_date),
                expected_return_date: injuryData.expected_return_date
                    ? new Date(injuryData.expected_return_date)
                    : null,
                is_active: true
            }
        });
    }

    async resolveInjury(injuryId) {
        const injury = await prisma.injuries.findUnique({
            where: { injury_id: BigInt(injuryId) }
        });

        if (!injury) {
            throw new Error("Reporte de lesión no encontrado");
        }

        return prisma.injuries.update({
            where: { injury_id: BigInt(injuryId) },
            data: { is_active: false }
        });
    }
}

module.exports = new InjuryService();