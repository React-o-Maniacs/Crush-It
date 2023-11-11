// components/Task.tsx
import React from 'react';

// components/Task.tsx
export type TaskPriority = 'Top Priority' | 'Important' | 'Other';

export interface TaskData {
  id: string;
  title: string;
  priority: TaskPriority;
}
// ... rest of your Task component


interface TaskProps {
  task: TaskData;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
        <span className="flex-1">{task.title}</span>
        {/* Add more elements here if needed */}
      </div>
    </div>
  );
};

export default Task;
