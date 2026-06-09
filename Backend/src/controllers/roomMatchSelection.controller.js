const roomMatchSelectionService =
    require("../services/roomMatchSelection.service");

class RoomMatchSelectionController {
    async getAll(req, res) {
        try {
            const result =
                await roomMatchSelectionService.getAll();

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByRoom(req, res) {
        try {
            const { roomId } = req.params;

            const result =
                await roomMatchSelectionService.getByRoom(
                    roomId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getByMatch(req, res) {
        try {
            const { matchId } = req.params;

            const result =
                await roomMatchSelectionService.getByMatch(
                    matchId
                );

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const result =
                await roomMatchSelectionService.create(
                    req.body
                );

            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { selectionId } =
                req.params;

            await roomMatchSelectionService.delete(
                selectionId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Selección eliminada correctamente"
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports =
    new RoomMatchSelectionController();