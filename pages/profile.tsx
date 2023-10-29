import SideBanner from "@/components/SideBanner";
import ProfileAvatar from "../components/ProfileAvatar";
import React, { useState } from "react";
import UserImage from "../public/images/profile.svg";
import Input from "../components/Input";
import LockImage from '../public/images/lock.svg';

const Profile = () => {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
                inputFieldClassName="flex-1"
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
                inputFieldClassName="flex-1"
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-9 mx-4">Change Password</h2>

        <div className="bg-white p-4 shadow-md my-4 mx-4 rounded-lg">
          <div className="flex flex-row space-x-4">
            <div className="flex-1">
              <Input
                image={LockImage}
                label="Current Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentPassword(e.target.value)
                }
                id="currentPassword"
                type="password"
                value={currentPassword}
                alt="Current Password"
                inputFieldClassName="flex-1"
              />
            </div>
            <div className="flex-1">
              <Input
                image={LockImage}
                label="New Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPassword(e.target.value)
                }
                id="newPassword"
                type="password"
                value={newPassword}
                alt="New Password"
                inputFieldClassName="flex-1"
              />
            </div>
            <div className="flex-1">
              <Input
                image={LockImage}
                label="Confirm New Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                alt="Confirm New Password"
                inputFieldClassName="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
