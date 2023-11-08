import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';




type TaskPriority = 'Top Priority' | 'Important' | 'Other';

interface TaskProps {
  task: {
    id: number;
    title: string;
    priority: TaskPriority;
  };
}

const Task: React.FC<TaskProps> = ({ task }) => {



  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
        <span className={`flex-1`}>{task.title}</span>

      </div>
    </div>
  );
};

export default Task;
