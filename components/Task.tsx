// components/Task.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import rightArrow from "../public/images/right-arrow.svg";
import moveImage from "../public/images/Drag.svg";

// components/Task.tsx
export type TaskPriority = 'Top Priority' | 'Important' | 'Other';

export interface TaskData {
  id: string;
  title: string;
  priority: TaskPriority;
  notes: string;
}
// ... rest of your Task component


interface TaskProps {
  task: TaskData;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const arrowStyle = {
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  };

  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
        <span className="flex-1">{task.title}</span>
        {/* Add more elements here if needed */}
        <button className="p-2 ml-2 rounded">
          <Image
            src={moveImage}
            alt="Move Task"
          />
        </button>
        <button onClick={handleToggleExpand} className="p-2 rounded">
          <Image
            src={rightArrow}
            alt="Expand"
            style={arrowStyle}
          />
        </button>
      </div>
      {/* Expandable area for more task info */}
      {isExpanded && (
        <div className="mt-4 p-4 rounded">
          {/* Replace this with the actual task details */}
          <div>{task.notes}</div>
        </div>
      )}

    </div>
  );
};

export default Task;
