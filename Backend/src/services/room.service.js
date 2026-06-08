const prisma = require("../config/prisma");

/**
 * Genera un código de acceso aleatorio y alfanumérico.
 * @param {number} length - Longitud del código.
 * @returns {string} Código generado.
 */
function generateAccessCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

class RoomService {
    /**
     * Crea una sala nueva y añade al creador automáticamente como miembro.
     */
    async createRoom(userId, roomName) {
        let accessCode;
        let exists = true;

        // Validar unicidad del código de acceso
        while (exists) {
            accessCode = generateAccessCode();
            const room = await prisma.rooms.findUnique({
                where: { access_code: accessCode }
            });
            exists = !!room;
        }

        // Usamos una transacción para garantizar la atomicidad de los datos
        return await prisma.$transaction(async (tx) => {
            const newRoom = await tx.rooms.create({
                data: {
                    room_name: roomName,
                    owner_user_id: Number(userId),
                    access_code: accessCode
                }
            });

            await tx.room_members.create({
                data: {
                    room_id: newRoom.room_id,
                    user_id: Number(userId)
                }
            });

            return newRoom;
        });
    }

    /**
     * Permite a un usuario unirse a una sala mediante su código de acceso.
     */
    async joinRoom(userId, accessCode) {
        const room = await prisma.rooms.findUnique({
            where: { access_code: accessCode }
        });

        if (!room) {
            throw new Error("Sala no encontrada");
        }

        const member = await prisma.room_members.findFirst({
            where: {
                room_id: room.room_id,
                user_id: Number(userId)
            }
        });

        if (member) {
            throw new Error("Ya perteneces a esta sala");
        }

        await prisma.room_members.create({
            data: {
                room_id: room.room_id,
                user_id: Number(userId)
            }
        });

        return room;
    }

    /**
     * Obtiene los detalles de una sala específica.
     */
    async getRoom(roomId) {
        return await prisma.rooms.findUnique({
            where: { room_id: Number(roomId) }
        });
    }

    /**
     * Obtiene todos los miembros pertenecientes a una sala con sus datos de usuario.
     */
    async getMembers(roomId) {
        return await prisma.room_members.findMany({
            where: { room_id: Number(roomId) },
            include: {
                users: true // Asegúrate que la relación en tu schema.prisma se llame 'users'
            }
        });
    }

    /**
     * Transfiere la propiedad/administración de la sala a otro usuario.
     */
    async transferOwnership(roomId, currentOwnerId, newOwnerId) {
        const room = await prisma.rooms.findUnique({
            where: { room_id: Number(roomId) }
        });

        if (!room) {
            throw new Error("Sala no encontrada");
        }

        if (room.owner_user_id !== Number(currentOwnerId)) {
            throw new Error("No eres propietario de la sala");
        }

        await prisma.rooms.update({
            where: { room_id: Number(roomId) },
            data: { owner_user_id: Number(newOwnerId) }
        });

        return true;
    }

    /**
     * Elimina a un miembro de la sala (Siempre que no sea el dueño actual).
     */
    async leaveRoom(roomId, userId) {
        const room = await prisma.rooms.findUnique({
            where: { room_id: Number(roomId) }
        });

        if (!room) {
            throw new Error("Sala no encontrada");
        }

        if (room.owner_user_id === Number(userId)) {
            throw new Error("Debes transferir la propiedad antes de salir");
        }

        await prisma.room_members.deleteMany({
            where: {
                room_id: Number(roomId),
                user_id: Number(userId)
            }
        });

        return true;
    }
}

// Exportamos la instancia única (Singleton)
module.exports = new RoomService();