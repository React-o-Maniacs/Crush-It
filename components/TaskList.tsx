import React from 'react';
import Task from './task';

interface TaskListProps {
  priority: string;
}

const TaskList: React.FC<TaskListProps> = ({ priority }) => {
  // This is where you'd fetch tasks based on priority
  // For now, we'll use dummy data
  const tasks = [
    { id: 1, title: 'Top Priority Task', status: 'notStarted', priority: 'Top Priority' },
    { id: 2, title: 'Important Priority Task', status: 'inProgress', priority: 'Important' },
    { id: 3, title: 'Other Priority Task', status: 'rolledOver', priority: 'Other' },

    // Add more dummy tasks with different priorities
  ];

  // Filter tasks based on the priority passed to the component
  const filteredTasks = tasks.filter(task => task.priority === priority);

  return (
    <div>
      {filteredTasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
