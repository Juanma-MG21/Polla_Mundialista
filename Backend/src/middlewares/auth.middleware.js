const { verifyToken } = require("../utils/jwt");

/**
 * Middleware de autenticación JWT.
 * Verifica el token Bearer del header Authorization.
 * Carga req.user con el payload decodificado: { userId, roleId }
 * Nota: userId y roleId son strings (BigInt serializado).
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token requerido",
      });
    }

    // Validar formato "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>",
      });
    }

    const token = parts[1];
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
}

/**
 * Middleware de autorización por rol.
 * Debe usarse después de authMiddleware.
 * @param {...string} roles - Nombres de roles permitidos (ej: "ADMIN", "USER")
 *
 * USO: router.get("/ruta", authMiddleware, requireRole("ADMIN"), handler)
 *
 * NOTA: Este middleware compara roleId (string) contra la tabla roles.
 * Para una validación simple por roleId numérico se puede extender.
 * Se recomienda incluir el roleName en el token en versiones futuras.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }
    // req.user.roleId es string (BigInt serializado)
    // Esta validación se usa cuando se pase el roleName en el token.
    // Ver auth.service.js para la inclusión del roleName.
    if (roles.length > 0 && !roles.includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para realizar esta acción",
      });
    }
    next();
  };
}

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
