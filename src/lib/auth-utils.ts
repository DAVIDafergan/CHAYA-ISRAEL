import type { Session } from 'next-auth';

/**
 * Checks if the given session belongs to an admin user.
 * Admin users either have the 'admin' role or the hardcoded admin email.
 */
export function isAdminSession(session: Session | null): boolean {
  if (!session?.user) return false;
  return (
    session.user.role === 'admin' ||
    session.user.email?.toLowerCase() === 'chaya123@chayaisrael.com'
  );
}
