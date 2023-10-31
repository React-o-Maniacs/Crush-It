import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  let currentUser;
  try {
    const authResult = await serverAuth(req, res);
    currentUser = authResult.currentUser;
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!currentUser.email) {
    console.error("Email is not defined for the authenticated user");
    return res.status(400).json({ error: 'Email is required for password change' });
  }
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const user = await prismadb.user.findUnique({
      where: {
        email: currentUser.email
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword!);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prismadb.user.update({
      where: {
        email: currentUser.email
      },
      data: {
        hashedPassword: hashedPassword
      }
    });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
