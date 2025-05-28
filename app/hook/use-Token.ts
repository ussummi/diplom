import dayjs from 'dayjs';
import { getSession } from 'next-auth/react';

export async function iToken(): Promise<string | null> {
  try {
    const session: any = await getSession();

    if (!session) {
      console.warn('Session not found.');
      return null;
    }

    const token = session.token;  // Make sure you have token in session callback!
    const expiresAt = dayjs(session.expires);
    const now = dayjs();

    if (!token) {
      console.warn('Token not found in session.');
      return null;
    }

    if (expiresAt.isBefore(now)) {
      console.warn('Session token expired.');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
}
