import React from "react";
import Image from "next/image";
import userImage from "../public/images/profile.svg";
import { signOut } from 'next-auth/react';
import { useRouter } from "next/router";
import useCurrentUser from "@/hooks/useCurrentUser";

interface ProfileAvatarProps {
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name }) => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <div className="relative group">
      <div className="flex items-center cursor-pointer z-10" onClick={handleProfileClick}>
        <div className="rounded-full bg-gradient-to-r bg-crush-it-blue bg-opacity-[15%] p-1">
          <Image
            className="rounded-full"
            src={userImage}
            alt="Profile"
            objectFit="cover"
          />
        </div>
        <label className="text-gray-700 text-sm font-normal ml-2">{user?.email}</label>
      </div>

      <div className="absolute top-full mt-2 right-0 bg-white shadow-md rounded-md py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
        <button 
          onClick={handleSignOut}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Sign Out
        </button>
      </div>
        {/* Invisible bridge */}
        <div className="absolute right-0 h-2 w-full bg-transparent top-full group-hover:h-8"></div>
    </div>



  );
};

export default ProfileAvatar;
