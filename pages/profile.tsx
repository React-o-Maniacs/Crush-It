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
  const [FirstName, setFirstName] = useState(user?.firstName ? String(user.firstName) : "");
  const [LastName, setLastName] = useState(user?.lastName ? String(user.lastName) : "");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(user?.pomodoro?.toString() || '25');
  const [shortBreakTime, setShortBreakTime] = useState(user?.shortBreak?.toString() || '5');
  const [longBreakTime, setLongBreakTime] = useState(user?.longBreak?.toString() || '15');
  
  useEffect(() => {
    if (user) {
      setPomodoroTime(user.pomodoro?.toString() || '25');
      setShortBreakTime(user.shortBreak?.toString() || '5');
      setLongBreakTime(user.longBreak?.toString() || '15');
    }
  }, [user]);


  
  const updateUserInfo = async () => {
    try {
      const response = await fetch('/api/updateUserInfo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: FirstName || "",
          lastName: LastName || ""
        }),
        credentials: 'same-origin'
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User info updated successfully:', data);
      } else {
        const data = await response.json();
        console.error('Failed to update user info:', data);
      }
    } catch (error) {
      console.error('Failed to update user info', error);
    }
  };
  
  
  
  

  const validatePassword = (password: string): string | null => {
    if (password.length < 12) {
      return "Password should be at least 12 characters long";
    }
  
    const conditions = [
      /[A-Z]/.test(password), // Uppercase letter
      /[a-z]/.test(password), // Lowercase letter
      /[0-9]/.test(password), // Number
      /[^A-Za-z0-9]/.test(password) // Special character (no spaces)
    ];
  
    const trueConditions = conditions.filter(Boolean).length;
    
    if (trueConditions < 2) {
      return "Password should meet at least two of the following: include an uppercase letter, a lowercase letter, a number, or a special character (no spaces)";
    }
  
    return null;
  };

  const handleSave = async () => {
    try {
      await updateUserInfo();
      // Update pomodoro settings
      const pomodoroResponse = await fetch('/api/pomodoroSettings', {
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
  
      if (pomodoroResponse.ok) {
        const data = await pomodoroResponse.json();
        console.log('Pomodoro settings saved:', data);
      } else {
        console.error('Failed to save pomodoro settings');
      }

      const validationError = validatePassword(newPassword);
      if (validationError) {
        console.error(validationError);
        return;
      }
  
      // Change password if fields are filled out
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          console.error('New password and confirm new password do not match');
          return;
        }
        await handleChangePassword();
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };
  

  const handleChangePassword = async () => {
    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
        credentials: 'same-origin'
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Password changed successfully:', data);
        // Optionally, clear the password fields after successful change
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        console.error('Failed to change password:', data);
      }
    } catch (error) {
      console.error('Failed to change password', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBanner />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1>Profile</h1>
            <ProfileAvatar name={(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}`.trim() : user?.userName || ""}/>
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
