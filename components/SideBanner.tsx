import React from "react";
import Image from "next/image";
import CrushItLogo from '../public/images/crush-it-logo.svg';
import { signOut } from 'next-auth/react';
import logout from '../public/images/logout.svg';
import { useRouter } from "next/router";



const SideBanner = () => {
  const router = useRouter();

  const handleIconClick = () => {
    router.push("/");
  };


  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  return (
    <div className="flex bg-crush-it-black justify-center max-w-[10%] min-h-screen p-5">
      <div className='flex flex-col items-center gap-y-[5%]'>
        <h1 className="font-Fredoka font-bold text-[30px] text-white mt-[10%]" onClick={handleIconClick}>Crush It</h1>
        <div className="bg-crush-it-line h-[2px] w-[70%]"/>
        <Image src={CrushItLogo} alt='Crush It Logo' width={150} height={150}/>
        <p className="text-white font-bold text-center text-[20px]">It's time to plan your day!</p>
        <button className="h-[54px] w-[158px] opacity-100 hover:bg-black text-white text-[18px] font-bold rounded-[14px] border-x border-y">Plan Day</button>
        <div className="mt-auto">
          <div className="mt-[-100px]">
            <button
              onClick={handleSignOut}
              className="h-[38px] w-[101px] opacity-100 hover:bg-black text-white text-[12px] rounded-[11px] border-x border-y mt-5 flex items-center justify-center gap-x-2"
            >
              <Image src={logout} alt='Crush It Logo' width={24} height={24}/>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBanner;
