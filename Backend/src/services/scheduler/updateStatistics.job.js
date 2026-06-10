const prisma = require("../../config/prisma");

async function updateStatistics() {
    const teams = await prisma.teams.findMany({
        where: { is_active: true },
        select: { team_id: true }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const team of teams) {
        const matches = await prisma.matches.findMany({
            where: {
                status: "FINISHED",
                OR: [
                    { home_team_id: team.team_id },
                    { away_team_id: team.team_id }
                ]
            }
        });

        let wins = 0, draws = 0, losses = 0;
        let goalsFor = 0, goalsAgainst = 0, cleanSheets = 0;

        for (const match of matches) {
            const isHome = match.home_team_id === team.team_id;
            const gf = isHome ? match.home_score : match.away_score;
            const ga = isHome ? match.away_score : match.home_score;

            if (gf > ga) wins++;
            else if (gf === ga) draws++;
            else losses++;

            goalsFor += gf;
            goalsAgainst += ga;
            if (ga === 0) cleanSheets++;
        }

        await prisma.team_statistics.upsert({
            where: {
                team_statistic_id: (await prisma.team_statistics.findFirst({
                    where: { team_id: team.team_id, snapshot_date: today },
                    select: { team_statistic_id: true }
                }))?.team_statistic_id ?? BigInt(0)
            },
            create: {
                team_id: team.team_id,
                snapshot_date: today,
                matches_played: matches.length,
                wins, draws, losses,
                goals_for: goalsFor,
                goals_against: goalsAgainst,
                clean_sheets: cleanSheets
            },
            update: {
                matches_played: matches.length,
                wins, draws, losses,
                goals_for: goalsFor,
                goals_against: goalsAgainst,
                clean_sheets: cleanSheets
            }
        });
    }

    return { processed: teams.length };
}

module.exports = updateStatistics;