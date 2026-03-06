/**
 * Central JWT configuration.
 *
 * IMPORTANT:
 * - Keep signing + verification using the same secret.
 * - In production, always set JWT_SECRET in the environment.
 */
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-key';

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


