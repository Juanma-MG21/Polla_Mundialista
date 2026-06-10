const prisma = require("../config/prisma");

class PredictionVersionService {
    async create(matchId) {
    const match =
        await prisma.matches.findUnique({
            where: {
                match_id: BigInt(matchId)
            }
        });

    if (!match) {
        throw new Error(
            "Partido no encontrado"
        );
    }

    await prisma.prediction_versions.updateMany({
        where: {
            match_id: BigInt(matchId),
            is_active: true
        },
        data: {
            is_active: false
        }
    });

    const latestVersion =
        await prisma.prediction_versions.findFirst({
            where: {
                match_id: BigInt(matchId)
            },
            orderBy: {
                version_number: "desc"
            }
        });

    const nextVersion =
        latestVersion
            ? latestVersion.version_number + 1
            : 1;

    return prisma.prediction_versions.create({
        data: {
            match_id: BigInt(matchId),

            generated_at:
                new Date(),

            version_number:
                nextVersion,

            is_active: true
        }
    });
}
    async getByMatch(matchId) {
        return prisma.prediction_versions.findMany({
            where: {
                match_id: BigInt(matchId)
            },
            include: {
                markets: true
            },
            orderBy: {
                version_number: "desc"
            }
        });
    }

    async getLatest(matchId) {
        return prisma.prediction_versions.findFirst({
            where: {
                match_id: BigInt(matchId),
                is_active: true
            },
            include: {
                markets: true
            },
            orderBy: {
                version_number: "desc"
            }
        });
    }

    async deactivate(versionId) {
        const version =
            await prisma.prediction_versions.findUnique({
                where: {
                    prediction_version_id:
                        BigInt(versionId)
                }
            });

        if (!version) {
            throw new Error(
                "Versión no encontrada"
            );
        }

        return prisma.prediction_versions.update({
            where: {
                prediction_version_id:
                    BigInt(versionId)
            },
            data: {
                is_active: false
            }
        });
    }
}

module.exports =
    new PredictionVersionService();