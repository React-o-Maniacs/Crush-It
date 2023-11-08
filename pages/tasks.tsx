import React from 'react';
import SideBanner from "@/components/SideBanner";
import ProfileAvatar from "../components/ProfileAvatar";
import PrioritySection from '../components/PrioritySection';
import useCurrentUser from "@/hooks/useCurrentUser";

const TasksPage: React.FC = () => {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex min-h-screen">
      <SideBanner />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1></h1>
            <ProfileAvatar
              name={
                (user?.firstName && user?.lastName)
                  ? `${user.firstName} ${user.lastName}`.trim()
                  : user?.userName || ""
              }
            />
          </div>
        </div>

        {/* Container around the tasks */}
        <div className="container p-4">
        <h1 className="text-4xl font-bold mb-2">Tasks</h1>
          <div className="flex">
            {/* Tasks Section with white container */}
            <div className="flex-1 bg-white shadow rounded-lg p-4">
              <PrioritySection priority="Top Priority" />
              <PrioritySection priority="Important" />
              <PrioritySection priority="Other" />
            </div>
            {/* Appointments Section placeholder */}
            <div className="flex-1">
              {/* Appointment components will go here later */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
