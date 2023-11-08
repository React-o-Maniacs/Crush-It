import React from 'react';

interface PrioritySectionProps {
  priority: string;
}

const PrioritySection: React.FC<PrioritySectionProps> = ({ priority }) => {
  return (
    <div className="bg-crush-it-grey p-4 my-6 rounded">
      <h3 className="text-xl font-bold mb-2">{priority}</h3>
    </div>
  );
};

export default PrioritySection;
