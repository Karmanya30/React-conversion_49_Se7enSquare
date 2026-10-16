import { UserRecord } from './in-memory-db';

export type SanitizedUser = Omit<UserRecord, 'password' | 'passwordHash'>;

/**
 * Strips sensitive fields (plain password and password hash) before returning
 * user records across all API endpoints.
 */
export function sanitizeUser(user: UserRecord): SanitizedUser {
  const { password: _password, passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser as SanitizedUser;
}
