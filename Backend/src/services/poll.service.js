const prisma = require("../config/prisma");

class PollService {
    /**
     * Crea una encuesta con sus respectivas opciones dentro de una transacción.
     * @param {number} userId - ID del usuario creador.
     * @param {number} roomId - ID de la sala a la que pertenece.
     * @param {string} title - Pregunta o título de la encuesta.
     * @param {string[]} options - Array con los textos de las opciones.
     */
    async createPoll(userId, roomId, title, options) {
        if (!options || options.length < 2) {
            throw new Error("La encuesta debe tener mínimo dos opciones");
        }

        // Ejecutamos de forma atómica para evitar encuestas sin opciones si algo falla
        return await prisma.$transaction(async (tx) => {
            const poll = await tx.polls.create({
                data: {
                    room_id: Number(roomId),
                    created_by_user_id: Number(userId),
                    title,
                    status: "OPEN"
                }
            });

            // Mapeamos las opciones para crearlas simultáneamente en la transacción
            const optionPromises = options.map((optionText) => 
                tx.poll_options.create({
                    data: {
                        poll_id: poll.poll_id,
                        option_text: optionText
                    }
                })
            );

            await Promise.all(optionPromises);
            
            return poll;
        });
    }

    /**
     * Registra el voto de un usuario en una opción si cumple las condiciones.
     */
    async vote(userId, pollId, optionId) {
        const poll = await prisma.polls.findUnique({
            where: { poll_id: Number(pollId) }
        });

        if (!poll) {
            throw new Error("Encuesta no encontrada");
        }

        if (poll.status !== "OPEN") {
            throw new Error("La encuesta está cerrada");
        }

        // Verificar si el usuario ya emitió un voto en esta encuesta
        const existingVote = await prisma.poll_votes.findFirst({
            where: {
                poll_id: Number(pollId),
                user_id: Number(userId)
            }
        });

        if (existingVote) {
            throw new Error("Ya votaste esta encuesta");
        }

        return await prisma.poll_votes.create({
            data: {
                poll_id: Number(pollId),
                poll_option_id: Number(optionId),
                user_id: Number(userId)
            }
        });
    }

    /**
     * Cierra una encuesta abierta y registra el momento de cierre.
     */
    async closePoll(pollId) {
        const poll = await prisma.polls.findUnique({
            where: { poll_id: Number(pollId) }
        });

        if (!poll) {
            throw new Error("Encuesta no encontrada");
        }

        return await prisma.polls.update({
            where: { poll_id: Number(pollId) },
            data: {
                status: "CLOSED",
                closed_at: new Date()
            }
        });
    }

    /**
     * Obtiene los detalles de una encuesta incluyendo sus opciones disponibles.
     */
    async getPoll(pollId) {
        return await prisma.polls.findUnique({
            where: { poll_id: Number(pollId) },
            include: {
                poll_options: true // Verifica que en tu schema.prisma la relación se llame así
            }
        });
    }

    /**
     * Obtiene todas las encuestas de una sala ordenadas por fecha de creación.
     */
    async getRoomPolls(roomId) {
        return await prisma.polls.findMany({
            where: { room_id: Number(roomId) },
            include: {
                poll_options: true // Es útil traer las opciones de una vez para listarlas en el feed
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new PollService();