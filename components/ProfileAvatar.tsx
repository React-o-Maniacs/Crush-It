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
        <label className="text-gray-700 text-sm font-normal ml-2">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}</label>
      </div>
    </div>
  );
};

export default ProfileAvatar;
