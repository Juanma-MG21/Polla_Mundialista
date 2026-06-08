const prisma = require("./prisma");

async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL conectado correctamente");
    } catch (error) {
        console.error("❌ Error al conectar a PostgreSQL:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();