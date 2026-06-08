const jwt = require("jsonwebtoken");

/**
 * Genera token JWT.
 * IMPORTANTE: user_id y role_id son BigInt en PostgreSQL/Prisma.
 * Se convierten a String para evitar errores de serialización JSON
 * en el payload del JWT. Todos los consumidores deben tratar estos
 * valores como strings o convertirlos explícitamente.
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }

  return jwt.sign(
    {
      userId: user.user_id.toString(),
      roleId: user.role_id.toString(),
    },
    secret,
    {
      expiresIn: "7d",
    }
  );
}

/**
 * Verifica y decodifica un token JWT.
 * Retorna el payload con userId y roleId como strings.
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }
  return jwt.verify(token, secret);
}

module.exports = {
  generateToken,
  verifyToken,
};
