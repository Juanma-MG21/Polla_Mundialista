const marketTypeService =
    require("../services/marketType.service");

class MarketTypeController {
    async getAll(req, res) {
        try {
            const result =
                await marketTypeService.getAll();

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

    async getById(req, res) {
        try {
            const { marketTypeId } =
                req.params;

            const result =
                await marketTypeService.getById(
                    marketTypeId
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
                await marketTypeService.create(
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

    async update(req, res) {
        try {
            const { marketTypeId } =
                req.params;

            const result =
                await marketTypeService.update(
                    marketTypeId,
                    req.body
                );

            return res.status(200).json({
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
            const { marketTypeId } =
                req.params;

            await marketTypeService.delete(
                marketTypeId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Tipo de mercado eliminado correctamente"
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
    new MarketTypeController();