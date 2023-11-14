import React from "react";
import Image from "next/image";
import userImage from "../public/images/profile.svg";

const Header = () => {
  return (
    <div className="flex">
      <div className="flex-1 bg-white-100 p-4 shadow-md flex justify-between items-start">
        <h1>Profile</h1>
        <div className="flex items-center">
          <div className="flex items-center">
            <Image
              src={userImage}
              alt="Profile"
              objectFit="cover"
              className="rounded-full"
              //background color of image
              style={{ backgroundColor: "crush-it-blue" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
