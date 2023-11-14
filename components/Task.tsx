import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import rightArrow from "../public/images/right-arrow.svg";
import moveImage from "../public/images/Drag.svg";
import notStartedIcon from "../public/images/not-started.svg";
import inProgressIcon from "../public/images/in-progress.svg";
import completeIcon from "../public/images/complete.svg";
import rolledOverIcon from "../public/images/rolled-over.svg";
import toast, { Toaster } from 'react-hot-toast';


export type TaskPriority = 'Top Priority' | 'Important' | 'Other';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Complete' | 'Rolled Over';

export interface TaskData {
  id: string;
  title: string;
  priority: TaskPriority;
  notes: string;
  date: string;
  status: TaskStatus
}


const taskStatuses: Record<TaskStatus, { icon: StaticImageData; next: TaskStatus }> = {
  'Not Started' : { icon: notStartedIcon, next: 'In Progress' },
  'In Progress': { icon: inProgressIcon, next: 'Complete' },
  'Complete': { icon: completeIcon, next: 'Rolled Over' },
  'Rolled Over': { icon: rolledOverIcon, next: 'Not Started' },
};

const updateTaskStatus = async (taskId: String, newStatus: TaskStatus) => {
  try {
    const response = await fetch('/api/updateTaskStatus', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId: taskId,
        newStatus: newStatus,
      }),
    });

    if (!response.ok) {
      toast.error('Error updating task status')
      //throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // Handle the response data if needed
    toast.success('Task status updated')
    console.log('Task status updated:', data);
  } catch (error) {
    toast.error('Error updating task status')
    console.error('Error updating task status:', error);
  }
};


interface TaskProps {
  task: TaskData;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [TaskStatus, setTaskStatus] = useState<TaskStatus>(task.status || 'Not Started');


  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = async () => {
    const nextStatus = taskStatuses[TaskStatus]?.next;
    if (nextStatus) {
      setTaskStatus(nextStatus);
    } else {
      toast.error('Next status not found for current status');
      console.error(`Next status not found for current status: ${TaskStatus}`);
    }
    await updateTaskStatus(task.id, nextStatus);
  };
  

    // Check if the status is valid before rendering
    if (!taskStatuses[TaskStatus]) {
      toast.error("Error with Status");
      console.error(`Invalid status: ${TaskStatus}`);
      // You could render a fallback or handle this error appropriately here
      // For now, let's just return null to avoid crashing the app
      return null;
    }

  const arrowStyle = {
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  };

  return (
    <div className="bg-white p-2 my-2 rounded">
      <div className="flex items-center">
      <button onClick={handleStatusChange} className="p-2 rounded">
          <Image
            src={taskStatuses[TaskStatus].icon}
            alt="Task Status"
          />
        </button>
        <span className="flex-1 text-crush-it-blue font-bold text-lg">{task.title}</span>
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
        <div className="mt-1 p-1 mx-1 rounded">
          <hr className="border-gray-300 my-2" />
          <div className="text-crush-it-light-grey font-semibold text-sm">Notes</div>
          {/* Replace this with the actual task details */}
          <div className="font-bold text-lg">{task.notes}</div>
        </div>
      )}
    </div>
  );
};

export default Task;
