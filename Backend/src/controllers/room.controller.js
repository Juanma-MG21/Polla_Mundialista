const roomService = require("../services/room.service");

class RoomController {
    /**
     * @route   POST /api/rooms
     * @desc    Crea una nueva sala
     */
    async create(req, res) {
        try {
            const { room_name } = req.body;
            
            if (!room_name) {
                return res.status(400).json({
                    success: false,
                    message: "El nombre de la sala es obligatorio"
                });
            }

            const room = await roomService.createRoom(
                req.user.userId,
                room_name
            );

            return res.status(201).json({
                success: true,
                message: "Sala creada exitosamente",
                data: room
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al crear la sala"
            });
        }
    }

    /**
     * @route   POST /api/rooms/join
     * @desc    Une a un usuario a una sala mediante código de acceso
     */
    async join(req, res) {
        try {
            const { access_code } = req.body;

            if (!access_code) {
                return res.status(400).json({
                    success: false,
                    message: "El código de acceso es obligatorio"
                });
            }

            const room = await roomService.joinRoom(
                req.user.userId,
                access_code
            );

            return res.status(200).json({
                success: true,
                message: "Te has unido a la sala exitosamente",
                data: room
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   GET /api/rooms/:roomId
     * @desc    Obtiene los detalles de una sala por su ID
     */
    async getRoom(req, res) {
        try {
            const { roomId } = req.params;

            const room = await roomService.getRoom(roomId);

            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Sala no encontrada"
                });
            }

            return res.status(200).json({
                success: true,
                data: room
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener la sala"
            });
        }
    }

    /**
     * @route   GET /api/rooms/:roomId/members
     * @desc    Obtiene la lista de miembros de una sala
     */
    async getMembers(req, res) {
        try {
            const { roomId } = req.params;

            const members = await roomService.getMembers(roomId);

            return res.status(200).json({
                success: true,
                data: members
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Error al obtener los miembros"
            });
        }
    }

    /**
     * @route   PUT /api/rooms/:roomId/transfer
     * @desc    Transfiere la propiedad de la sala a otro usuario
     */
    async transferOwnership(req, res) {
        try {
            const { roomId } = req.params;
            const { new_owner_id } = req.body;

            if (!new_owner_id) {
                return res.status(400).json({
                    success: false,
                    message: "El ID del nuevo propietario es obligatorio"
                });
            }

            await roomService.transferOwnership(
                roomId,
                req.user.userId,
                new_owner_id
            );

            return res.status(200).json({
                success: true,
                message: "Propiedad transferida exitosamente"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @route   DELETE /api/rooms/:roomId/leave
     * @desc    Permite a un usuario abandonar una sala
     */
    async leave(req, res) {
        try {
            const { roomId } = req.params;

            await roomService.leaveRoom(
                roomId,
                req.user.userId
            );

            return res.status(200).json({
                success: true,
                message: "Has abandonado la sala exitosamente"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

// Exportamos una instancia única (Singleton)
module.exports = new RoomController();