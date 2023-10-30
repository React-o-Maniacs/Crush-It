import SideBanner from "@/components/SideBanner";
import ProfileAvatar from "../components/ProfileAvatar";
import React, { useState, useEffect } from "react";
import UserImage from "../public/images/profile.svg";
import Input from "../components/Input";
import LockImage from '../public/images/lock.svg';
import TimerIcon from '../public/images/clock.svg';
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useSession } from "next-auth/react";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Profile = () => {
  const { data: user } = useCurrentUser();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(''); // default to 25 minutes
  const [shortBreakTime, setShortBreakTime] = useState(''); // default to 5 minutes
  const [longBreakTime, setLongBreakTime] = useState(''); // default to 15 minutes

  useEffect(() => {
    if (user) {
      setPomodoroTime(user.pomodoro?.toString() || '25');
      setShortBreakTime(user.shortBreak?.toString() || '5');
      setLongBreakTime(user.longBreak?.toString() || '15');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/pomodoroSettings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pomodoro: parseInt(pomodoroTime),
          shortBreak: parseInt(shortBreakTime),
          longBreak: parseInt(longBreakTime)
        }),
        credentials: 'same-origin'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Settings saved:', data);
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };
  return (
    <div className="flex min-h-screen">
      <SideBanner />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1>Profile</h1>
            <ProfileAvatar name={user?.userName} />
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

        <h2 className="text-2xl font-semibold mt-9 mx-4">Pomodoro Timer (Minutes)</h2>

        <div className="bg-white p-4 shadow-md my-4 mx-4 rounded-lg">
          <div className="flex flex-row space-x-4">
            <div className="flex-1">
              <Input
                image={TimerIcon}
                alt="Pomodoro"
                label="Pomodoro (minutes)"
                onChange={(e: any) => setPomodoroTime(e.target.value)}
                id="pomodoroTime"
                type="number"
                value={pomodoroTime}
                inputFieldClassName="flex-1"
              />
            </div>
            <div className="flex-1">
              <Input
                image={TimerIcon}
                alt="Short Break"
                label="Short Break (minutes)"
                onChange={(e: any) => setShortBreakTime(e.target.value)}
                id="shortBreakTime"
                type="number"
                value={shortBreakTime}
                inputFieldClassName="flex-1"
              />
            </div>
            <div className="flex-1">
              <Input
                image={TimerIcon}
                alt="Long Break"
                label="Long Break (minutes)"
                onChange={(e: any) => setLongBreakTime(e.target.value)}
                id="longBreakTime"
                type="number"
                value={longBreakTime}
                inputFieldClassName="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center my-20 space-x-4">
          <button className="h-[60px] w-[270px] bg-white hover:from-sky-500 hover:to-blue-600 text-crush-it-blue text-[18px] font-bold py-2 px-4 rounded-[16px] border border-crush-it-blue ">
            Cancel
          </button>
          <button onClick={handleSave} className="h-[60px] w-[270px] bg-gradient-to-b from-crush-it-blue to-crush-it-blue-g hover:from-sky-500 hover:to-blue-600 text-white text-[18px] font-bold py-2 px-4 rounded-[16px] ">
            Save
          </button>
        </div>



      </div>
    </div>
  );
};

export default Profile;
