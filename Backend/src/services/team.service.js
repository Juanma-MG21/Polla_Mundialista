const prisma = require("../config/prisma");

class TeamService {
    async getAllTeams() {
        return prisma.teams.findMany({
            orderBy: { team_name: "asc" }
        });
    }

    async getTeam(teamId) {
        return prisma.teams.findUnique({
            where: { team_id: BigInt(teamId) }
        });
    }

    async createTeam(teamData) {
        if (!teamData.team_name?.trim()) {
            throw new Error("El nombre del equipo es obligatorio");
        }

        return prisma.teams.create({
            data: { team_name: teamData.team_name.trim() }
        });
    }

    async updateTeam(teamId, teamData) {
        if (!teamData.team_name?.trim()) {
            throw new Error("El nombre del equipo no puede estar vacío");
        }

        const teamExists = await this.getTeam(teamId);
        if (!teamExists) {
            throw new Error("Equipo no encontrado");
        }

        return prisma.teams.update({
            where: { team_id: BigInt(teamId) },
            data: { team_name: teamData.team_name.trim() }
        });
    }

    async deleteTeam(teamId) {
        const teamExists = await this.getTeam(teamId);
        if (!teamExists) {
            throw new Error("Equipo no encontrado");
        }

        return prisma.teams.delete({
            where: { team_id: BigInt(teamId) }
        });
    }
}

module.exports = new TeamService();