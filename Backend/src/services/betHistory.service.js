const prisma = require("../config/prisma");
const { serializeBigInt } = require("../utils/bigint");

const EVENT_INCLUDE = {
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
};

function mapTeam(team) {
  if (!team) return { name: "Equipo", flag: "🏳️" };
  return {
    name: team.team_name,
    flag: team.fifa_code ? `[${team.fifa_code}]` : "⚽",
  };
}

function mapEventToBet(event, ticket) {
  const match = event.markets?.matches;
  const home = match?.teams_matches_home_team_idToteams;
  const away = match?.teams_matches_away_team_idToteams;
  const marketLabel =
    event.markets?.market_types?.description ||
    event.markets?.market_types?.code ||
    "Apuesta";

  return {
    bet_id: String(event.ticket_event_id),
    ticket_id: String(ticket.ticket_id),
    status: event.event_result || "PENDING",
    amount: Number(event.base_points),
    potential_payout: Number(event.final_points),
    prediction: marketLabel,
    created_at: event.created_at,
    room_name: ticket.rooms?.room_name || null,
    match: match
      ? {
          competition: "Mundial 2026",
          home_team: mapTeam(home),
          away_team: mapTeam(away),
          home_score: match.home_score,
          away_score: match.away_score,
        }
      : {
          competition: "Mundial 2026",
          home_team: { name: "Local", flag: "🏳️" },
          away_team: { name: "Visitante", flag: "🏳️" },
          home_score: null,
          away_score: null,
        },
  };
}

class BetHistoryService {
  async getUserHistory(userId) {
    const tickets = await prisma.tickets.findMany({
      where: { user_id: BigInt(userId) },
      include: {
        rooms: { select: { room_name: true } },
        ticket_events: {
          include: EVENT_INCLUDE,
          orderBy: { created_at: "desc" },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const bets = [];
    for (const ticket of tickets) {
      for (const event of ticket.ticket_events) {
        bets.push(mapEventToBet(event, ticket));
      }
    }

    bets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return serializeBigInt(bets);
  }
}

module.exports = new BetHistoryService();
