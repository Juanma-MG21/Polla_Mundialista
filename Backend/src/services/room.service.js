const prisma = require("../config/prisma");

function generateAccessCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

class RoomService {
    async createRoom(userId, roomName) {
        let accessCode;
        let exists = true;

        while (exists) {
            accessCode = generateAccessCode();
            const room = await prisma.rooms.findUnique({
                where: { access_code: accessCode }
            });
            exists = !!room;
        }

        return prisma.$transaction(async (tx) => {
            const newRoom = await tx.rooms.create({
                data: {
                    room_name: roomName,
                    owner_user_id: BigInt(userId),
                    access_code: accessCode
                }
            });

            await tx.room_members.create({
                data: {
                    room_id: newRoom.room_id,
                    user_id: BigInt(userId)
                }
            });

            return newRoom;
        });
    }

    async joinRoom(userId, accessCode) {
        const room = await prisma.rooms.findUnique({
            where: { access_code: accessCode }
        });

        if (!room) throw new Error("Sala no encontrada");

        const member = await prisma.room_members.findFirst({
            where: {
                room_id: room.room_id,
                user_id: BigInt(userId)
            }
        });

        if (member) throw new Error("Ya perteneces a esta sala");

        await prisma.room_members.create({
            data: {
                room_id: room.room_id,
                user_id: BigInt(userId)
            }
        });

        return room;
    }

    async getRoom(roomId) {
        return prisma.rooms.findUnique({
            where: { room_id: BigInt(roomId) }
        });
    }

    async getMembers(roomId) {
        return prisma.room_members.findMany({
            where: { room_id: BigInt(roomId) },
            include: { users: true }
        });
    }

    async transferOwnership(roomId, currentOwnerId, newOwnerId) {
        const room = await prisma.rooms.findUnique({
            where: { room_id: BigInt(roomId) }
        });

        if (!room) throw new Error("Sala no encontrada");

        if (room.owner_user_id !== BigInt(currentOwnerId)) {
            throw new Error("No eres propietario de la sala");
        }

        await prisma.rooms.update({
            where: { room_id: BigInt(roomId) },
            data: { owner_user_id: BigInt(newOwnerId) }
        });

        return true;
    }

    async leaveRoom(roomId, userId) {
        const room = await prisma.rooms.findUnique({
            where: { room_id: BigInt(roomId) }
        });

        if (!room) throw new Error("Sala no encontrada");

        if (room.owner_user_id === BigInt(userId)) {
            throw new Error("Debes transferir la propiedad antes de salir");
        }

        await prisma.room_members.deleteMany({
            where: {
                room_id: BigInt(roomId),
                user_id: BigInt(userId)
            }
        });

        return true;
    }
}

module.exports = new RoomService();