import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ProfileAvatar from "../components/ProfileAvatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import SideBanner from "@/components/SideBanner";
import ArrowIcon from '../public/images/arrow.svg';
import Image from 'next/image';
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";

function getDaysInMonth(month: number): number[] {
  const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12) {
    throw new Error("Invalid month value. Month should be between 1 and 12.");
  }

  return Array.from({ length: maxDays[month - 1] }, (_, index) => index + 1);
}

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

  const monthsOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentMonth = monthsOptions[currentDate.getMonth()];
  const [selectedMonthOption, setSelectedMonthOption] = useState<string>(currentMonth);

  const handleMonthSelect = (option: string) => {
    setSelectedMonthOption(option);
  };

  const daysOptions = selectedMonthOption
    ? getDaysInMonth(monthsOptions.indexOf(selectedMonthOption) + 1).map(String)
    : getDaysInMonth(monthsOptions.indexOf("January") + 1).map(String);

  const currentDay = currentDate.getDate().toString();
  const [selectedDayOption, setSelectedDayOption] = useState<string>(currentDay);

  const handleDaySelect = (option: string) => {
    setSelectedDayOption(option);
  };

  const currentYear = currentDate.getFullYear();
  const yearsOptions = Array.from({ length: 5 }, (_, index) => (currentYear + index).toString());
  const [selectedYearOption, setSelectedYearOption] = useState<string>(currentYear.toString());

  const handleYearSelect = (option: string) => {
    setSelectedYearOption(option);
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
        <div className="flex bg-crush-it-blue bg-opacity-[15%] rounded-[10px] m-4 p-3 justify-center">
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3">
              <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <div className="flex ml-2">
            <Dropdown placeholder={currentMonth} options={monthsOptions} onSelect={handleMonthSelect} widthStyle="w-[200px]" />
          </div>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
              <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-6">
              <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <div className="flex ml-2">
            <Dropdown placeholder={currentDay} options={daysOptions} onSelect={handleDaySelect} widthStyle="w-[100px]" />
          </div>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
            <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-6">
              <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon" />
          </button>
          <div className="flex ml-2">
            <Dropdown placeholder={currentYear.toString()} options={yearsOptions} onSelect={handleYearSelect} widthStyle="w-[115px]" />
          </div>
          <button className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
            <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
