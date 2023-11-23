// Appointment.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import rightArrow from "../public/images/right-arrow.svg";
import ellipse from "../public/images/ellipse.svg";


export interface AppointmentData {
  id: string;
  title: string;
  startTime: number; // Assuming this is an hour in 24-hour format
  endTime: number;
}

const Appointment: React.FC<AppointmentData> = ({ id, title, startTime, endTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to calculate top position based on start time
  const calculateTopPosition = (startTime: number): number => {
    // Assuming each hour block is 60px in height
    return (startTime+1) * 60;
  };

  // Function to calculate height based on duration
  const calculateHeight = (startTime: number, endTime: number): number => {
    return (endTime - startTime) * 60;
  };


  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const arrowStyle = {
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  };


  const isDurationLongerThanOneHour = (endTime - startTime) > 1;

  const appointmentStyle = {
    top: `${calculateTopPosition(startTime)}px`,
    height: isExpanded && !isDurationLongerThanOneHour ? `calc(${calculateHeight(startTime, endTime)}px + 60px)` : `${calculateHeight(startTime, endTime)}px`,
    // The additional 100px is an example; adjust based on your content
  };

  return (
    <div
      className="absolute left-0 right-0 ml-20 mr-2 bg-white p-2 shadow border border-crush-it-border-grey"
      style={appointmentStyle}
    >
      <div className="flex items-center">
        {/* <span className=" text-crush-it-text-black font-semibold text-lg mr-2 ">Focus Time</span> */}
        <Image src={ellipse} alt="Ellipse" className="ml-2 mr-1" />
        <span className="flex-1 text-crush-it-text-black font-semibold text-lg">{title}</span>
        <button onClick={handleToggleExpand} className="p-2 rounded">
          <Image
            src={rightArrow}
            alt="Expand"
            style={arrowStyle}
          />
        </button>
      </div>
      {isExpanded && (
        <div className="bg-white p-2 my-2 rounded">
        <hr className="border-gray-300 my-2" />
          {/* Editable fields and content here */}
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex-1 text-#1F1F1F font-semibold text-sm">
                Appointment Notes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
      

