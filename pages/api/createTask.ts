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
      const { title, numOfPomodoroTimers, notes, priority } = req.body;
  
      const createdTask = await prismadb.task.create({
        data: {
          title,
          numOfPomodoroTimers,
          notes,
          priority,
          userId: currentUser.id, // Assuming your task model has a userId field
        },
      });
  
      return res.status(200).json({ success: true, task: createdTask });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }