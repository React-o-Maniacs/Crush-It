import React from "react";
import Image from "next/image";
import CrushItLogo from '../public/images/crush-it-logo.svg';

const SideBanner = () => {
  return (
    <div className="flex bg-crush-it-black justify-center max-w-[15%] min-h-screen p-5">
      <div className='flex flex-col items-center gap-y-[5%]'>
        <h1 className="font-normal text-[30px] text-white mt-[10%]">Crush It</h1>
        <div className="bg-crush-it-line h-[2px] w-[70%]"/>
        <Image src={CrushItLogo} alt='Crush It Logo' width={150} height={150}/>
        <p className="text-white font-bold text-center text-[20px]">It's time to plan your day!</p>
        <button className="h-[54px] w-[158px] opacity-100 hover:bg-black text-white text-[18px] font-bold rounded-[14px] border-x border-y">Plan Day</button>
      </div>
    </div>
  );
};

export default SideBanner;
