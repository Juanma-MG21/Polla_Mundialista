const injuryService = require("../services/injury.service");

class InjuryController {
    async getActive(req, res) {
        try {
            const { teamId } = req.params;
            const injuries = await injuryService.getActiveInjuriesByTeam(teamId);

            return res.status(200).json({ success: true, data: injuries });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { player_id, injury_description, start_date, expected_return_date } = req.body;

            const injury = await injuryService.createInjury({
                player_id,
                injury_description,
                start_date,
                expected_return_date
            });

            return res.status(201).json({
                success: true,
                message: "Reporte de lesión creado exitosamente",
                data: injury
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async resolve(req, res) {
        try {
            const { injuryId } = req.params;
            const updatedInjury = await injuryService.resolveInjury(injuryId);

            return res.status(200).json({
                success: true,
                message: "Alta médica registrada exitosamente",
                data: updatedInjury
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new InjuryController();