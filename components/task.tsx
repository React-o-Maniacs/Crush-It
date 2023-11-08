import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import rightArrow from "../public/images/rightarrow.svg";
import downArrow from "../public/images/downarrow.svg";
import notStartedIcon from "../public/images/completeIcon.svg";
import inProgressIcon from "../public/images/inProgressIcon.svg";
import completeIcon from "../public/images/completeIcon.svg";
import rolledOverIcon from "../public/images/rolledOverIcon.svg";

type TaskStatus = 'notStarted' | 'inProgress' | 'complete' | 'rolledOver';

const taskStatuses: Record<TaskStatus, { icon: StaticImageData; next: TaskStatus }> = {
  notStarted: { icon: notStartedIcon, next: 'inProgress' },
  inProgress: { icon: inProgressIcon, next: 'complete' },
  complete: { icon: completeIcon, next: 'rolledOver' },
  rolledOver: { icon: rolledOverIcon, next: 'notStarted' },
};

type TaskPriority = 'Top Priority' | 'Important' | 'Other';

interface TaskProps {
  task: {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
  };
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<TaskStatus>(task.status || 'notStarted');
  // Debug log to see what the status is before rendering
  console.log('Rendering Task with status:', status);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = () => {
    const nextStatus = taskStatuses[status]?.next;
    if (nextStatus) {
      setStatus(nextStatus);
    } else {
      console.error(`Next status not found for current status: ${status}`);
    }
  };

  // Check if the status is valid before rendering
  if (!taskStatuses[status]) {
    console.error(`Invalid status: ${status}`);
    // You could render a fallback or handle this error appropriately here
    // For now, let's just return null to avoid crashing the app
    return null;
  }

  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
        <button onClick={handleStatusChange} className="p-2 rounded">
          <Image
            src={taskStatuses[status].icon}
            alt="Task Status"

          />
        </button>
        <span className={`flex-1 ${status === 'complete' ? 'line-through' : ''}`}>{task.title}</span>
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
