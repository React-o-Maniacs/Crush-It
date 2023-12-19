import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end(); // Send the response here
        return; // Make sure to return here to prevent further execution
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
    const formattedCurrentDate = new Date().toLocaleDateString('en-US'); // Format date as "month/day/year"

    // Get tasks for the current day
    const tasksForCurrentDay = await prismadb.task.findMany({
      where: {
        userId: currentUser.id,
        date: formattedCurrentDate,
      },
    });

    const pomodoroValue = await prismadb.user.findUnique({
        where: {
            id: currentUser.id,
        },
        select: {
            pomodoro : true,
        },
    });

    const shortBreakValue = await prismadb.user.findUnique({
        where: {
            id: currentUser.id,
        },
        select: {
            shortBreak : true,
        },
    });

    let pomodoroTime = 0;

    if (pomodoroValue && shortBreakValue) {
      pomodoroTime = pomodoroValue.pomodoro + shortBreakValue.shortBreak;
    } else {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

    // Find available time slots

    let currentHour = new Date().getHours();
    let startTime = currentHour + 1;
    let endTime = startTime;
    
    for (const task of tasksForCurrentDay) {
        let taskTotalTime = 0;
        if (task.numOfPomodoroTimers && pomodoroTime) {
          taskTotalTime = (task.numOfPomodoroTimers * pomodoroTime)/60;
        }
        
        if (currentHour < 6) {
            let startTime = 6;
        } else {
            let startTime = currentHour + 1
        }
        let endTime = startTime + taskTotalTime;
    
        while (endTime <= 20) {
            let existingAppointment = await prismadb.appointment.findFirst({
              where: {
                userId: currentUser.id,
                date: formattedCurrentDate,
                OR: [
                  { startTime: { lt: endTime }, endTime: { gt: startTime } },
                ],
              },
              orderBy: {
                startTime: 'asc',
              },
            });
          
            let existingFocusTime = await prismadb.focusTime.findFirst({
              where: {
                userId: currentUser.id,
                date: formattedCurrentDate,
                OR: [
                  { startTime: { lt: endTime }, endTime: { gt: startTime } },
                ],
              },
              orderBy: {
                startTime: 'asc',
              },
            });
    
          if (!existingAppointment && !existingFocusTime) {
            // Create a focusTime entry for each task
            await prismadb.focusTime.create({
              data: {
                title: task.title,
                notes: task.notes,
                startTime,
                endTime,
                numOfPomodoroTimers: task.numOfPomodoroTimers,
                remainingNumOfPomodoros: 0,
                date: formattedCurrentDate, // current date
                user: { connect: { id: currentUser.id } }, // connect to the current user
              },
            });
    
            break; // Exit the loop as we've found a suitable time slot
          }

          
    
          // Increment the start time by 1 hour and update the end time
          startTime++;
          endTime = startTime + taskTotalTime;
        }
        if (endTime > 20) {
          console.log("No time slots available for task:", task.title);
          return res.status(404).json({ error: 'No time slots available for task(s)' });
        }
      }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

