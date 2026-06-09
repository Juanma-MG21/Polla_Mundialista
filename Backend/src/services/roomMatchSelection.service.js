const prisma = require("../config/prisma");

class RoomMatchSelectionService {
    async getAll() {
        return prisma.room_match_selections.findMany({
            include: {
                rooms: true,
                matches: true,
                users: true
            },
            orderBy: {
                selected_at: "desc"
            }
        });
    }

    async getByRoom(roomId) {
        return prisma.room_match_selections.findMany({
            where: {
                room_id: BigInt(roomId)
            },
            include: {
                matches: true,
                users: true
            },
            orderBy: {
                selected_at: "desc"
            }
        });
    }

    async getByMatch(matchId) {
        return prisma.room_match_selections.findMany({
            where: {
                match_id: BigInt(matchId)
            },
            include: {
                rooms: true,
                users: true
            }
        });
    }

    async create(data) {
        const room =
            await prisma.rooms.findUnique({
                where: {
                    room_id: BigInt(data.room_id)
                }
            });

        if (!room) {
            throw new Error(
                "Sala no encontrada"
            );
        }

        const match =
            await prisma.matches.findUnique({
                where: {
                    match_id: BigInt(data.match_id)
                }
            });

        if (!match) {
            throw new Error(
                "Partido no encontrado"
            );
        }

        const user =
            await prisma.users.findUnique({
                where: {
                    user_id: BigInt(
                        data.selected_by_user_id
                    )
                }
            });

        if (!user) {
            throw new Error(
                "Usuario no encontrado"
            );
        }

        const existingSelection =
            await prisma.room_match_selections.findFirst(
                {
                    where: {
                        room_id: BigInt(
                            data.room_id
                        ),
                        match_id: BigInt(
                            data.match_id
                        )
                    }
                }
            );

        if (existingSelection) {
            throw new Error(
                "El partido ya fue seleccionado para esta sala"
            );
        }

        return prisma.room_match_selections.create({
            data: {
                room_id: BigInt(
                    data.room_id
                ),

                match_id: BigInt(
                    data.match_id
                ),

                selected_by_user_id:
                    BigInt(
                        data.selected_by_user_id
                    )
            }
        });
    }

    async delete(selectionId) {
        const selection =
            await prisma.room_match_selections.findUnique(
                {
                    where: {
                        room_match_selection_id:
                            BigInt(
                                selectionId
                            )
                    }
                }
            );

        if (!selection) {
            throw new Error(
                "Selección no encontrada"
            );
        }

        return prisma.room_match_selections.delete({
            where: {
                room_match_selection_id:
                    BigInt(
                        selectionId
                    )
            }
        });
    }
}

module.exports =
    new RoomMatchSelectionService();