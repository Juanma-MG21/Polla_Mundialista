const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

/**
 * Genera hash de contraseña
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara contraseña vs hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
