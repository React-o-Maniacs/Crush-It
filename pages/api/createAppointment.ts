import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

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

  if (!currentUser.id) {
    console.error("ID is not defined for the authenticated user");
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { title, startTime, endTime, date, recurring} = req.body;

    const createdAppointment = await prismadb.appointment.create({
      data: {
        title,
        startTime,
        endTime,
        date,
        userId: currentUser.id,
        recurring
      },
    });

    console.log("Task created:", createdAppointment);

    return res.status(200).json({ success: true, task: createdAppointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
