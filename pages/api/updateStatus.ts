// /pages/api/tasks/updateStatus.ts
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

  const { taskId, newStatus } = req.body;

  if (!taskId || !newStatus) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  try {
    const updatedTask = await prismadb.task.update({
      where: {
        id: taskId
      },
      data: {
        status: newStatus
      }
    });

    return res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
