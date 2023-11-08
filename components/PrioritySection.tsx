import React from 'react';
import TaskList from './TaskList';

interface PrioritySectionProps {
  priority: string;
}

const PrioritySection: React.FC<PrioritySectionProps> = ({ priority }) => {
  return (
    <div className="bg-crush-it-grey p-4 my-6 rounded">
      <h3 className="text-xl font-bold mb-2">{priority}</h3>
      <TaskList priority={priority} />
    </div>
  );
};

export default PrioritySection;
