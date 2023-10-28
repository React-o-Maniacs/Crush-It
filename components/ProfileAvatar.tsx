import React from "react";
import Image from "next/image";
import userImage from "../public/images/profile.svg";

interface ProfileAvatarProps {
  name: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name }) => {
  return (
    <div className="flex items-center">
      <div className="relative rounded-full bg-gradient-to-r bg-crush-it-blue bg-opacity-[15%] p-1">
        <Image
          className="rounded-full"
          src={userImage}
          alt="Profile"
          objectFit="cover"
        />
      </div>
      <label className="text-gray-700 text-sm font-normal ml-2">{name}</label>
    </div>
  );
};

export default ProfileAvatar;
