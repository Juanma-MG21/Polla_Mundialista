const prisma = require("../config/prisma");
const { serializeBigInt } = require("../utils/bigint");

function formatMatchLabel(match) {
  if (!match) return "Partido";
  const home = match.teams_matches_home_team_idToteams?.team_name || "Local";
  const away = match.teams_matches_away_team_idToteams?.team_name || "Visitante";
  return `${home} vs ${away}`;
}

class MovementsService {
  async getRecent(limit = 50) {
    const events = await prisma.ticket_events.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        tickets: {
          include: {
            users: {
              select: {
                user_id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            rooms: { select: { room_name: true } },
          },
        },
        markets: {
          include: {
            market_types: true,
            matches: {
              include: {
                teams_matches_home_team_idToteams: true,
                teams_matches_away_team_idToteams: true,
              },
            },
          },
        },
      },
    });

    const movements = events.map((event) => {
      const user = event.tickets?.users;
      const matchLabel = formatMatchLabel(event.markets?.matches);
      const marketLabel =
        event.markets?.market_types?.description ||
        event.markets?.market_types?.code ||
        "Apuesta";
      const points = Number(event.final_points);
      const result = event.event_result || "PENDING";

      return {
        movement_id: String(event.ticket_event_id),
        user_id: user ? String(user.user_id) : null,
        user: user?.username || "desconocido",
        user_name: [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username,
        user_email: user?.email || null,
        action: "Apuesta",
        target: `${matchLabel} · ${marketLabel}`,
        match_label: matchLabel,
        market_label: marketLabel,
        room_name: event.tickets?.rooms?.room_name || null,
        amount: `+${points} pts`,
        points,
        status: result,
        win: result === "WON",
        created_at: event.created_at,
      };
    });

    return serializeBigInt(movements);
  }
}

module.exports = new MovementsService();
