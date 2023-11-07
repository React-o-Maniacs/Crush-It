import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ProfileAvatar from "../components/ProfileAvatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import SideBanner from "@/components/SideBanner";
import ArrowIcon from '../public/images/arrow.svg';
import Image from 'next/image';
import { useState } from "react";
import Dropdown from "@/components/Dropdown";

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

export default function Home() {
  const { data: user } = useCurrentUser();

  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

 return (
    <div className="flex min-h-screen">
      <SideBanner />
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md">
          <div className="flex justify-end">
            <ProfileAvatar name={(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}`.trim() : user?.userName || ""}/>
          </div>
        </div>
        <div className="flex bg-crush-it-blue bg-opacity-[15%] rounded-[10px] m-4 p-4 justify-center">
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4">
              <Image className='scale-150' src={ArrowIcon} alt="Arrow Icon" />
          </button>
           <div className="container mx-auto p-4">
            <Dropdown defaultLabel='Month' options={options} onSelect={handleSelect} />
          </div>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4 ml-2">
              <Image className='scale-150 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4 ml-6">
              <Image className='scale-150' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4 ml-2">
              <Image className='scale-150 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4 ml-6">
              <Image className='scale-150' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-4 ml-2">
              <Image className='scale-150 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
        </div>
      </div>
    </div>
  )
}
