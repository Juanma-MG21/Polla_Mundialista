const teamRatingService = require("../teamRating.service");
const playerRatingService = require("../playerRating.service");
const prisma = require("../../config/prisma");

async function generateRatings() {
    const teams = await prisma.teams.findMany({
        where: { is_active: true },
        select: { team_id: true }
    });

    for (const team of teams) {
        const stats = await prisma.team_statistics.findFirst({
            where: { team_id: team.team_id },
            orderBy: { snapshot_date: "desc" }
        });

        if (!stats) continue;

        const matchesPlayed = Number(stats.matches_played) || 1;
        const winRate = Number(stats.wins) / matchesPlayed * 100;
        const goalDiff = (Number(stats.goals_for) - Number(stats.goals_against)) / matchesPlayed;
        const offensive = Math.min(100, Math.max(0, winRate * 0.5 + goalDiff * 5 + 30));
        const defensive = Math.min(100, Math.max(0, (Number(stats.clean_sheets) / matchesPlayed) * 100));
        const contextual = Math.min(100, Math.max(0, winRate));

        await teamRatingService.createSnapshot({
            team_id: team.team_id,
            offensive_rating: offensive,
            defensive_rating: defensive,
            contextual_rating: contextual
        });
    }

    const players = await prisma.players.findMany({
        where: { is_active: true },
        select: { player_id: true }
    });

    for (const player of players) {
        const stats = await prisma.player_statistics.findFirst({
            where: { player_id: player.player_id },
            orderBy: { snapshot_date: "desc" }
        });

        if (!stats) continue;

        const matchesPlayed = Number(stats.matches_played) || 1;
        const offensive = Math.min(100, Math.max(0,
            (Number(stats.goals) / matchesPlayed) * 40 +
            (Number(stats.shots_on_target) / matchesPlayed) * 10 + 20
        ));
        const form = Math.min(100, Math.max(0,
            100 - (Number(stats.yellow_cards) * 5) - (Number(stats.red_cards) * 15)
        ));
        const fatigue = Math.min(100, Math.max(0,
            (Number(stats.minutes_played) / (matchesPlayed * 90)) * 100
        ));

        await playerRatingService.createSnapshot({
            player_id: player.player_id,
            offensive_rating: offensive,
            form_rating: form,
            fatigue_rating: fatigue
        });
    }

    return { teams: teams.length, players: players.length };
}

module.exports = generateRatings;