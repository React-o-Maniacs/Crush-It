import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import rightArrow from "../public/images/rightarrow.svg";
import downArrow from "../public/images/downarrow.svg";



type TaskPriority = 'Top Priority' | 'Important' | 'Other';

interface TaskProps {
  task: {
    id: number;
    title: string;
    priority: TaskPriority;
  };
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
        <span className={`flex-1`}>{task.title}</span>
        <button onClick={handleToggleExpand} className="p-2 rounded">
          <Image
            src={isExpanded ? downArrow : rightArrow}
            alt="Expand"
          />
        </button>
      </div>
      {/* Expandable area for more task info */}
      {isExpanded && (
        <div className="mt-4 p-4 rounded">
          {/* Replace this with the actual task details */}
          <div>Task details go here.</div>
        </div>
      )}     
    </div>
  );
};

export default Task;
