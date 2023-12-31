import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import ProfileAvatar from "../components/ProfileAvatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import SideBanner from "@/components/SideBanner";
import ArrowIcon from '../public/images/arrow.svg';
import Image from 'next/image';
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import toast, { Toaster } from 'react-hot-toast';
import CreateTaskModal from "@/components/CreateTaskModal"
import AddTaskIcon from '../public/images/add-task.svg'
import Task, { TaskData } from "@/components/Task";
import TimerModal from "@/components/TimerModal";
import Appointment, { AppointmentData } from "@/components/Appointment";
import CreateAppointmentModal from "@/components/CreateAppointmentModal";
import FocusTime, { FocusTimeData } from "@/components/FocusTime";

function getDaysInMonth(year: number, month: number): number[] {
  // Check if it's a leap year (divisible by 4, not divisible by 100 unless also divisible by 400)
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const maxDays = [31, 28 + (isLeapYear ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
  const priorities = ['Top Priority', 'Important', 'Other'];

  const monthsOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();

  const currentMonth = monthsOptions[currentDate.getMonth()];
  const [selectedMonthOption, setSelectedMonthOption] = useState<string>(currentMonth);

  const currentYear = currentDate.getFullYear();
  const yearsOptions = Array.from({ length: 5 }, (_, index) => (currentYear + index).toString());
  const [selectedYearOption, setSelectedYearOption] = useState<string>(currentYear.toString());

  const [daysOptions, setDaysOptions] = useState<string[]>(getDaysInMonth(Number(selectedYearOption), currentDate.getMonth() + 1).map(String));

  // Check if it's a leap year (divisible by 4, not divisible by 100 unless also divisible by 400)
  const isLeapYear = (Number(selectedYearOption) % 4 === 0 && Number(selectedYearOption) % 100 !== 0) || (Number(selectedYearOption) % 400 === 0);

  const handleMonthSelect = (option: string) => {
    // Check if the previous month was February in a leap year
    const wasFebruaryLeapYear = monthsOptions.indexOf(selectedMonthOption) === 1 && isLeapYear;
    setSelectedMonthOption(option);

    // Check if the current month is February and the year is a leap year
    const isCurrentFebruaryLeapYear = monthsOptions.indexOf(option) === 1 && isLeapYear;

    const daysInSelectedMonth = getDaysInMonth(Number(selectedYearOption), monthsOptions.indexOf(option) + 1).map(String);
  
    // Update the selected day to the maximum day if it exceeds the days in the selected month
    setSelectedDayOption((prevDay) => {
      const newDay = Math.min(Number(prevDay), daysInSelectedMonth.length);
      return newDay.toString();
    });
  
  // If transitioning from February in a leap year to another month, adjust the days in February
  if (wasFebruaryLeapYear && !isCurrentFebruaryLeapYear) {
    setDaysOptions(getDaysInMonth(Number(selectedYearOption), 2).map(String));
  } else {
    setDaysOptions(daysInSelectedMonth);
  }
  };

  const currentDay = currentDate.getDate().toString();
  const [selectedDayOption, setSelectedDayOption] = useState<string>(currentDay);

  const handleDaySelect = (option: string) => {
    setSelectedDayOption(option);
  };

  const handleYearSelect = (option: string) => {
    setSelectedYearOption(option);

    // Get the maximum number of days for the selected month and year
    const daysInSelectedMonth = getDaysInMonth(Number(option), monthsOptions.indexOf(selectedMonthOption) + 1).map(String);

    // Update the selected day to the maximum day if it exceeds the days in the selected month
    setSelectedDayOption((prevDay) => {
      const newDay = Math.min(Number(prevDay), daysInSelectedMonth.length);
      return newDay.toString();
    });

    setDaysOptions(daysInSelectedMonth);
  };

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerModalTask, setTimerModalTask] = useState<TaskData | null>(null);

  const date = `${monthsOptions.indexOf(selectedMonthOption) + 1}/${selectedDayOption}/${selectedYearOption}`;

  const decrementMonthDropdownValue = () => {
    const currentIndex = monthsOptions.indexOf(selectedMonthOption);
    const newIndex = (currentIndex - 1 + monthsOptions.length) % monthsOptions.length;
    const newMonth = monthsOptions[newIndex];
  
    // Update the selected month
    setSelectedMonthOption(newMonth);
  
    // Check if the current day is valid for the new month
    const newDaysOptions = getDaysInMonth(Number(selectedYearOption), newIndex + 1).map(String);
  
    if (!newDaysOptions.includes(selectedDayOption)) {
      // If the current day is not valid, set the day to the last day of the new month
      setSelectedDayOption(newDaysOptions[newDaysOptions.length - 1]);
      setDaysOptions(newDaysOptions);
    }
  };
  
  const decrementDayDropdownValue = () => {
    const currentIndex = daysOptions.indexOf(selectedDayOption);
  
    if (currentIndex === 0) {
      // If the current day is 1, switch to the previous month
      const currentMonthIndex = monthsOptions.indexOf(selectedMonthOption);
      const newMonthIndex = (currentMonthIndex - 1 + monthsOptions.length) % monthsOptions.length;
      const newMonth = monthsOptions[newMonthIndex];
  
      // Set the day to the maximum day in the new month
      const newDaysOptions = getDaysInMonth(Number(selectedYearOption), newMonthIndex + 1).map(String);
      setSelectedDayOption(newDaysOptions[newDaysOptions.length - 1]);
      setDaysOptions(newDaysOptions);
  
      // Update the selected month
      setSelectedMonthOption(newMonth);
    } else {
      // Decrement the day within the current month
      const newIndex = (currentIndex - 1 + daysOptions.length) % daysOptions.length;
      setSelectedDayOption(daysOptions[newIndex]);
    }
  };

  const decrementYearDropdownValue = () => {
    const currentIndex = yearsOptions.indexOf(selectedYearOption);
    const newIndex = (currentIndex - 1 + yearsOptions.length) % yearsOptions.length;
    const newYear = yearsOptions[newIndex];
  
    // Update the selected year
    setSelectedYearOption(newYear);
  
    // Check if the current day is valid for the new month
    const currentMonthIndex = monthsOptions.indexOf(selectedMonthOption);
    const newDaysOptions = getDaysInMonth(Number(newYear), currentMonthIndex + 1).map(String);
  
    if (!newDaysOptions.includes(selectedDayOption)) {
      // If the current day is not valid, set the day to the last day of the new month
      setSelectedDayOption(newDaysOptions[newDaysOptions.length - 1]);
      setDaysOptions(newDaysOptions);
    }
  };
  
  const incrementMonthDropdownValue = () => {
    const currentIndex = monthsOptions.indexOf(selectedMonthOption);
    const newIndex = (currentIndex + 1) % monthsOptions.length;
    const newMonth = monthsOptions[newIndex];
  
    // Update the selected month
    setSelectedMonthOption(newMonth);
  
    // Check if the current day is valid for the new month
    const newDaysOptions = getDaysInMonth(Number(selectedYearOption), newIndex + 1).map(String);
  
    if (!newDaysOptions.includes(selectedDayOption)) {
      // If the current day is not valid, set the day to the last day of the new month
      setSelectedDayOption(newDaysOptions[newDaysOptions.length - 1]);
      setDaysOptions(newDaysOptions);
    }
  };

  const incrementYearDropdownValue = () => {
    const currentIndex = yearsOptions.indexOf(selectedYearOption);
    const newIndex = (currentIndex + 1) % yearsOptions.length;
    const newYear = yearsOptions[newIndex];

    setSelectedYearOption(newYear);
  
    // Get the maximum number of days for the selected month and year
    const daysInSelectedMonth = getDaysInMonth(Number(newYear), monthsOptions.indexOf(selectedMonthOption) + 1).map(String);

    // Update the selected day to the maximum day if it exceeds the days in the selected month
    setSelectedDayOption((prevDay) => {
      const newDay = Math.min(Number(prevDay), daysInSelectedMonth.length);
      return newDay.toString();
    });

    setDaysOptions(daysInSelectedMonth);
  };

  const incrementDayDropdownValue = () => {
    const currentIndex = daysOptions.indexOf(selectedDayOption);
    const newIndex = (currentIndex + 1) % daysOptions.length;
  
    // Check if it's the last day of the month
    const isLastDayOfMonth = newIndex === 0;
    // Check if it's the last day of December
    const isLastDayOfDecember = selectedMonthOption === 'December' && newIndex === 0;
  
    if (isLastDayOfMonth) {
      // Increment the month
      const currentMonthIndex = monthsOptions.indexOf(selectedMonthOption);
      const newMonthIndex = (currentMonthIndex + 1) % monthsOptions.length;
      const newMonth = monthsOptions[newMonthIndex];
  
      // Update the selected month
      setSelectedMonthOption(newMonth);
  
      // Update the selected day to the first day of the new month
      setSelectedDayOption(getDaysInMonth(Number(selectedYearOption), newMonthIndex + 1)[0].toString());
  
      // Update the daysOptions for the new month
      setDaysOptions(getDaysInMonth(Number(selectedYearOption), newMonthIndex + 1).map(String));
    } else if(isLastDayOfDecember) {
      // Increment the year
      const newYear = (parseInt(selectedYearOption, 10) + 1).toString();
  
      // Update the selected year
      setSelectedYearOption(newYear);
  
      // Update the selected month to January
      setSelectedMonthOption('January');
  
      // Update the selected day to the first day of January
      setSelectedDayOption(getDaysInMonth(Number(newYear), 1)[0].toString());
  
      // Update the daysOptions for January
      setDaysOptions(getDaysInMonth(Number(newYear), 1).map(String));
    }{
      // If it's not the last day of the month, simply update the selected day
      setSelectedDayOption(daysOptions[newIndex]);
    }
  };

  const [tasks, setTasks] = useState<TaskData[]>([]);
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/retrieveTask');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        toast.error('Error fetching tasks')
        console.error('Error fetching tasks');
      }
    } catch (error) {
      toast.error('Error fetching tasks')
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/retrieveAppointment');
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          console.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    useEffect(() => {
      fetchAppointments();
    }, []);

    console.log(appointments);

    const [focusTime, setFocusTime] = useState<FocusTimeData[]>([]);
    const fetchFocusTime = async () => {
      try {
        const response = await fetch('/api/retrieveFocusTime');
        if (response.ok) {
          const data = await response.json();
          setFocusTime(data);
        } else {
          console.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    useEffect(() => {
      fetchFocusTime();
    }, []);

    function calculateAppointmentPosition(startTime: number) {
      // Convert start time to pixels (1 hour = 60 pixels)
      return startTime * 60;
    }

    function calculateAppointmentHeight(startTime: number, endTime: number) {
      // Calculate duration in hours and convert to pixels
      return (endTime - startTime) * 60;
    }

    const handleTaskTitleClick = (selectedTask: TaskData) => {
      // Open TimerModal and pass the selected task
      setShowTimerModal(true);
      setTimerModalTask(selectedTask);
    };

    const filteredAppointments = appointments.filter((appointment) => {
      // Check if the appointment's date matches the selected date
      if (appointment.date === date) {
        return true;
      }
  
      // Check if it's a recurring appointment with "daily" recurrence
      if (appointment.recurring) {
        return true;
      }
  
      return false;
    });


    const filteredFocusTime = focusTime.filter((focusTime) => {
      // Check if the appointment's date matches the selected date
      if (focusTime.date === date) {
        return true;
      }
  
      return false;
    });

    return (
      <>
        <Toaster position="top-right" />
        <div className="flex min-h-screen bg-crush-it-grey">
          <SideBanner />
          <div className="flex-1 flex flex-col">
            <div className="bg-white p-4 shadow-md">
              <div className="flex justify-end">
                <ProfileAvatar name={(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}`.trim() : user?.userName || ""}/>
              </div>
            </div>
            <div className="flex bg-crush-it-blue bg-opacity-[15%] rounded-[10px] m-4 p-3 justify-center">
              <button onClick={decrementMonthDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3">
                  <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon Previous Month" />
              </button>
              <div className="flex ml-2">
                <Dropdown selectedOption={selectedMonthOption} options={monthsOptions} onChange={handleMonthSelect} widthStyle="w-[200px]" />
              </div>
              <button onClick={incrementMonthDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
                  <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon Next Month" />
              </button>
              <button onClick={decrementDayDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-6">
                  <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon Previous Day" />
              </button>
              <div className="flex ml-2">
                <Dropdown selectedOption={selectedDayOption} options={daysOptions} onChange={handleDaySelect} widthStyle="w-[100px]" />
              </div>
              <button onClick={incrementDayDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
                <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon Next Day" />
              </button>
              <button onClick={decrementYearDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-6">
                  <Image className='scale-125' src={ArrowIcon} alt="Arrow Icon Previous Year" />
              </button>
              <div className="flex ml-2">
                <Dropdown selectedOption={selectedYearOption} options={yearsOptions} onChange={handleYearSelect} widthStyle="w-[115px]" />
              </div>
              <button onClick={incrementYearDropdownValue} className="h-[50px] w-[50px] rounded-[10px] border border-crush-it-blue p-3 ml-2">
                <Image className='scale-125 rotate-180' src={ArrowIcon} alt="Arrow Icon Next Year" />
              </button>
            </div>
          <div className="flex container p-4">
            {/* Tasks Section 66% */}
            <div className="flex-1 min-w-[66%]"> 
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mb-2">Tasks</h1>
                <button
                  className="ml-2 border-3 border-solid border-white p-2"
                  onClick={() => setShowCreateTaskModal(true)}
                >
                  <Image src={AddTaskIcon} alt="Add Task Icon" />
                </button>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                {/* Tasks content */}
                {priorities.map((priority) => (
                  <div key={priority} className="bg-crush-it-grey p-4 my-6 rounded">
                    <h3 className="text-xl font-bold mb-2">{priority}</h3>
                    {tasks.filter(task => task.priority === priority && task.date === date).map(task => (
                      <Task key={task.id} task={task} onTaskTitleClick={handleTaskTitleClick} onTaskUpdate={fetchTasks} // Pass fetchTasks as a prop
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Appointments Section 45% */}
            <div className="flex-1 ml-4 min-w-[45%]">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold mb-2 py-1">Appointments</h1>
              <button
                  className="ml-2 border-3 border-solid border-white p-2"
                  onClick={() => setShowCreateAppointmentModal(true)}
                >
                  <Image src={AddTaskIcon} alt="Add Task Icon" />
                </button>
              </div>
              <div className="bg-white shadow rounded-[10px] p-2 relative overflow-y-scroll custom-scrollbar min-h-[640px]">
                {/* 24-hour timeline */}
                {[...Array(24)].map((_, hour) => (
                  <div key={hour} className="absolute left-0 w-full py-12" style={{ top: `${hour * 60}px` }}>
                    <span className="text-md pl-4">{`${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`}</span>
                  </div>
                ))}
                
                
                {/* Render Appointments */}
                {filteredAppointments.map(appointment => (
                  <Appointment 
                    key={appointment.id} 
                    id={appointment.id} 
                    title={appointment.title} 
                    startTime={appointment.startTime} 
                    endTime={appointment.endTime} 
                    date={appointment.date}
                    recurring={appointment.recurring}
                  />
                ))}
                {filteredFocusTime.map(focusTime => (
                  <FocusTime 
                    key={focusTime.id} 
                    id={focusTime.id} 
                    title={focusTime.title}
                    notes={focusTime.notes}
                    startTime={focusTime.startTime} 
                    endTime={focusTime.endTime}
                    numOfPomodoroTimers={focusTime.numOfPomodoroTimers}
                    remainingNumOfPomodoros={focusTime.remainingNumOfPomodoros}
                    date={focusTime.date}
                  />
                ))}
              </div>
            </div>
          </div>
      </div>
      {showCreateTaskModal && (
        <CreateTaskModal isVisible={showCreateTaskModal} onClose={() => setShowCreateTaskModal(false)} date={date} onTaskAdded={fetchTasks} />
      )}
      {showCreateAppointmentModal && (
        <CreateAppointmentModal isVisible={showCreateAppointmentModal} onClose={() => setShowCreateAppointmentModal(false)} initialDate={date} onAppointmentAdded={fetchAppointments} />
      )}
      {showTimerModal && (
        <TimerModal isVisible={showTimerModal} onClose={() => setShowTimerModal(false)} task={timerModalTask} user={user} />
      )}
    </div>
  </>
);
      }