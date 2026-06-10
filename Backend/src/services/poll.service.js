const prisma = require("../config/prisma");

class PollService {
    async createPoll(userId, roomId, title, options) {
        if (!options || options.length < 2) {
            throw new Error("La encuesta debe tener mínimo dos opciones");
        }

        return prisma.$transaction(async (tx) => {
            const poll = await tx.polls.create({
                data: {
                    room_id: BigInt(roomId),
                    created_by_user_id: BigInt(userId),
                    title,
                    status: "OPEN"
                }
            });

            await Promise.all(
                options.map((optionText) =>
                    tx.poll_options.create({
                        data: {
                            poll_id: poll.poll_id,
                            option_text: optionText
                        }
                    })
                )
            );

            return poll;
        });
    }

    async vote(userId, pollId, optionId) {
        const poll = await prisma.polls.findUnique({
            where: { poll_id: BigInt(pollId) }
        });

        if (!poll) throw new Error("Encuesta no encontrada");
        if (poll.status !== "OPEN") throw new Error("La encuesta está cerrada");

        const existingVote = await prisma.poll_votes.findFirst({
            where: {
                poll_id: BigInt(pollId),
                user_id: BigInt(userId)
            }
        });

        if (existingVote) throw new Error("Ya votaste esta encuesta");

        return prisma.poll_votes.create({
            data: {
                poll_id: BigInt(pollId),
                poll_option_id: BigInt(optionId),
                user_id: BigInt(userId)
            }
        });
    }

    async closePoll(pollId) {
        const poll = await prisma.polls.findUnique({
            where: { poll_id: BigInt(pollId) }
        });

        if (!poll) throw new Error("Encuesta no encontrada");

        return prisma.polls.update({
            where: { poll_id: BigInt(pollId) },
            data: { status: "CLOSED", closed_at: new Date() }
        });
    }

    async getPoll(pollId) {
        return prisma.polls.findUnique({
            where: { poll_id: BigInt(pollId) },
            include: { poll_options: true }
        });
    }

    async getRoomPolls(roomId) {
        return prisma.polls.findMany({
            where: { room_id: BigInt(roomId) },
            include: { poll_options: true },
            orderBy: { created_at: "desc" }
        });
    }
}

module.exports = new PollService();