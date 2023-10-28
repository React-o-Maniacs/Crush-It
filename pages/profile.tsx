import SideBanner from "@/components/SideBanner";
import ProfileAvatar from "../components/ProfileAvatar";
import React, { useState } from "react";
import UserImage from "../public/images/profile.svg";
import Input from "../components/Input";

const Profile = () => {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");

  return (
    <div className="flex min-h-screen">
      <SideBanner />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1>Profile</h1>
            <ProfileAvatar name="John Doe" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-9 mx-4">User Info</h2>

        <div className="bg-white p-4 shadow-md my-4 mx-4 rounded-lg">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                image={UserImage}
                alt="Image Icon"
                label="First Name"
                onChange={(e: any) => setFirstName(e.target.value)}
                id="firstName"
                type="text"
                value={FirstName}
              />
            </div>
            <div className="flex-1">
              <Input
                image={UserImage}
                alt="Image Icon"
                label="Last Name"
                onChange={(e: any) => setLastName(e.target.value)}
                id="lastName"
                type="text"
                value={LastName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
