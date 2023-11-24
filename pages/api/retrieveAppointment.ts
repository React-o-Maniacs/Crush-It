import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let currentUser;
    try {
      const authResult = await serverAuth(req, res);
      currentUser = authResult.currentUser;
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!currentUser || !currentUser.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const appointments = await prismadb.appointment.findMany({
        where: {
          userId: currentUser.id, // Filter appointments by the current user's ID
        },
        // Add any specific queries, filtering, or sorting here if needed
      });
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: `Error fetching appointments: ${(error as Error).message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
