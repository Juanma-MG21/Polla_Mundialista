const prisma = require("../config/prisma");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { serializeBigInt } = require("../utils/bigint");

// Campos seguros para devolver al cliente (excluye password_hash)
const USER_SAFE_SELECT = {
  user_id: true,
  role_id: true,
  username: true,
  email: true,
  first_name: true,
  last_name: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  roles: {
    select: {
      name: true,
      description: true,
    },
  },
};

class AuthService {
  /**
   * Registra un nuevo usuario.
   * - Verifica unicidad de username y email.
   * - Asigna automáticamente el rol USER.
   * - Almacena contraseña con bcrypt.
   * - Inicializa user_scores con valores en 0.
   * - Retorna datos seguros del usuario (sin password_hash) + JWT.
   */
  async register(data) {
    const { username, email, password, first_name, last_name } = data;

    // Validación básica de campos requeridos
    if (!username || !email || !password) {
      throw new Error("username, email y password son requeridos");
    }

    // Verificar unicidad
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("Usuario o email ya registrado");
    }

    // Buscar rol USER (debe existir en la tabla roles)
    const userRole = await prisma.roles.findFirst({
      where: { name: "USER" },
    });

    if (!userRole) {
      throw new Error("Rol USER no encontrado. Contacta al administrador.");
    }

    const passwordHash = await hashPassword(password);

    // Crear usuario e inicializar user_scores en una transacción
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          role_id: userRole.role_id,
          username,
          email,
          password_hash: passwordHash,
          first_name: first_name || null,
          last_name: last_name || null,
        },
        select: USER_SAFE_SELECT,
      });

      // Inicializar tabla user_scores para el nuevo usuario
      await tx.user_scores.create({
        data: {
          user_id: newUser.user_id,
          total_points: 0,
          total_events_played: 0,
          total_events_won: 0,
          total_events_lost: 0,
        },
      });

      return newUser;
    });

    // Generar token incluyendo roleName para requireRole middleware
    const token = generateToken({
      user_id: user.user_id,
      role_id: user.role_id,
      roleName: user.roles?.name,
    });

    return {
      user: serializeBigInt(user),
      token,
    };
  }

  /**
   * Autentica un usuario por email y contraseña.
   * - Verifica que el usuario exista y esté activo (is_active = true).
   * - Compara contraseña con bcrypt.
   * - Retorna datos seguros del usuario (sin password_hash) + JWT.
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error("email y password son requeridos");
    }

    // Buscar usuario incluyendo password_hash SOLO para comparación
    const userWithHash = await prisma.users.findUnique({
      where: { email },
      select: {
        ...USER_SAFE_SELECT,
        password_hash: true, // necesario para comparar, no se devuelve al cliente
      },
    });

    if (!userWithHash) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar que el usuario esté activo
    if (!userWithHash.is_active) {
      throw new Error("Cuenta desactivada. Contacta al administrador.");
    }

    const validPassword = await comparePassword(password, userWithHash.password_hash);

    if (!validPassword) {
      throw new Error("Credenciales inválidas");
    }

    // Construir objeto seguro sin password_hash
    const { password_hash, ...user } = userWithHash;

    // Generar token incluyendo roleName
    const token = generateToken({
      user_id: user.user_id,
      role_id: user.role_id,
      roleName: user.roles?.name,
    });

    return {
      user: serializeBigInt(user),
      token,
    };
  }

  /**
   * Obtiene el perfil completo del usuario autenticado desde la DB.
   * Garantiza datos actualizados (no depende solo del payload del JWT).
   */
  async getProfile(userId) {
    const user = await prisma.users.findUnique({
      where: { user_id: BigInt(userId) },
      select: {
        ...USER_SAFE_SELECT,
        user_scores: {
          select: {
            total_points: true,
            total_events_played: true,
            total_events_won: true,
            total_events_lost: true,
            updated_at: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (!user.is_active) {
      throw new Error("Cuenta desactivada");
    }

    return serializeBigInt(user);
  }

  async assertAdmin(userId) {
    const user = await prisma.users.findUnique({
      where: { user_id: BigInt(userId) },
      select: {
        roles: { select: { name: true } },
      },
    });

    if (!user || user.roles?.name !== "ADMIN") {
      throw new Error("Acceso denegado. Se requieren privilegios de Administrador.");
    }
  }

  async listUsers() {
    const users = await prisma.users.findMany({
      select: USER_SAFE_SELECT,
      orderBy: { user_id: "asc" },
    });

    return serializeBigInt(users);
  }

  async listRoles() {
    const roles = await prisma.roles.findMany({
      select: {
        role_id: true,
        name: true,
        description: true,
      },
      orderBy: { role_id: "asc" },
    });

    return serializeBigInt(roles);
  }

  async updateUser(userId, data) {
    const { first_name, last_name, email, role_id } = data;

    if (!first_name || !last_name || !email || !role_id) {
      throw new Error("first_name, last_name, email y role_id son requeridos");
    }

    const role = await prisma.roles.findUnique({
      where: { role_id: BigInt(role_id) },
    });

    if (!role) {
      throw new Error("Rol no válido");
    }

    const emailTaken = await prisma.users.findFirst({
      where: {
        email,
        NOT: { user_id: BigInt(userId) },
      },
    });

    if (emailTaken) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const user = await prisma.users.update({
      where: { user_id: BigInt(userId) },
      data: {
        first_name,
        last_name,
        email,
        role_id: BigInt(role_id),
        updated_at: new Date(),
      },
      select: USER_SAFE_SELECT,
    });

    return serializeBigInt(user);
  }

  async deleteUser(userId) {
    await prisma.users.delete({
      where: { user_id: BigInt(userId) },
    });
  }
}
module.exports = new AuthService();
