import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
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
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { firstName, lastName } = req.body;
  
    const updatedUser = await prismadb.user.update({
      where: {
        email: currentUser.email
      },
      data: {
        firstName,
        lastName
      }
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
