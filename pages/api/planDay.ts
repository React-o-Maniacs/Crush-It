import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
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
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString('en-US'); // Format date as "month/day/year"

    // Find the most recent day with tasks (excluding the current day's tasks)
    const mostRecentDayWithTasks = await prismadb.task.findFirst({
      where: {
        userId: currentUser.id,
        date: {
          lte: formattedCurrentDate, // Filter tasks with a date less than or equal to the current day
          not: formattedCurrentDate, // Exclude tasks with the current day's date
        },
      },
      orderBy: {
        date: 'desc', // Order by date in descending order to get the most recent day first
      },
    });

    if (!mostRecentDayWithTasks) {
      console.log("No tasks found for any day.");
      return res.status(200).json({ success: true, tasksFromPreviousDay: [] });
    }

    // Get tasks from the most recent day with tasks
    const tasksFromPreviousDay = await prismadb.task.findMany({
      where: {
        userId: currentUser.id,
        date: mostRecentDayWithTasks.date,
      },
    });

    // Update the status of the tasks from the previous day to "Rolled Over"
    await Promise.all(tasksFromPreviousDay.map(task =>
      task.status !== 'Complete'
        ? prismadb.task.update({
          where: { id: task.id },
          data: { status: 'Rolled Over' },
        })
        : Promise.resolve() // If the task is 'Complete', do nothing
    ));

    // Count the number of top priority tasks for the current day
    const topPriorityCount = await prismadb.task.count({
      where: {
        userId: currentUser.id,
        date: formattedCurrentDate,
        priority: 'Top Priority',
      },
    });

    const importantCount = await prismadb.task.count({
      where: {
        userId: currentUser.id,
        date: formattedCurrentDate,
        priority: 'Important',
      },
    });

    let myVariable = 1;

    if (importantCount === 0) {
        myVariable = 0;
    }

    let topPriorityCountCurrent = topPriorityCount;
    let importantCountCurrent = importantCount;

    // Count the total number of tasks for the current day
    const totalTasksCount = await prismadb.task.count({
      where: {
        userId: currentUser.id,
        date: formattedCurrentDate,
      },
    });

    // Create the new tasks
    const tasksForCurrentDay = tasksFromPreviousDay
      .filter(task => task.status !== 'Complete')
      .sort((a, b) => {
        // Sort tasks by priority: Top Priority > Important > Other
        const priorities = ['Top Priority', 'Important', 'Other'];
        return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      })
      .map(task => {
        const { id, ...taskWithoutID } = task; // Remove the id from the task
        let newPriority;

        if (totalTasksCount === 0) {
          // If there are no tasks in the current day, go through the existing rules to set the priority
          if (topPriorityCountCurrent < 3 || task.priority === 'Top Priority') {
            newPriority = 'Top Priority';
            topPriorityCountCurrent++;
          } else if (task.priority === 'Top Priority' && topPriorityCountCurrent === 3) {
            newPriority = 'Important';
            importantCountCurrent++;
          } else if (task.priority === 'Important' && topPriorityCountCurrent === 3) {
            newPriority = 'Important';
            importantCountCurrent++;
          } else if (myVariable === 0 && task.priority === 'Other') {
            newPriority = 'Important';
            importantCountCurrent++;
          } else {
            newPriority = 'Other';
          }
        } else {
          // If there are tasks in the current day, set the priority of all new tasks to 'Other'
          newPriority = 'Other';
        }

        return {
          ...taskWithoutID,
          date: formattedCurrentDate,
          status: 'Not Started', // Set status to 'Not Started'
          priority: newPriority // Set the new priority
        };
      });

    // Save the tasks for the current day
    const savedTasksForCurrentDay = await prismadb.task.createMany({
      data: tasksForCurrentDay,
    });

    console.log("Tasks transferred to the current day:", savedTasksForCurrentDay);

    return res.status(200).json({ success: true, tasksFromPreviousDay });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}