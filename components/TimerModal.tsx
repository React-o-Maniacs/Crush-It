import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CloseIcon from '../public/images/close-circle.svg';
import PencilIcon from "../public/images/pencil.svg";
import Image from 'next/image';
import { TaskData } from './Task';
import blueRectangle from "../public/images/blue-rectangle-for-check.svg";
import CheckIcon from '../public/images/check-icon.svg';

interface TimerModalProps {
  isVisible: boolean;
  onClose: () => void;
  task: TaskData | null;
  user: { pomodoro: number; shortBreak: number; longBreak: number };
}

const TimerModal: React.FC<TimerModalProps> = ({ isVisible, onClose, task, user }) => {
  const [selectedButton, setSelectedButton] = useState<string>('pomodoro');
  const [notes, setNotes] = useState<string>(task?.notes || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [maxPomos, setMaxPomos] = useState<number>(task?.numOfPomodoroTimers || 0);
  const [pomos, setPomos] = useState<number>(0);
  const [timer, setTimer] = useState<number>(25 * 60);
  const [finishAt, setFinishAt] = useState<string>('Not started');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  const pomodoroTimer = user?.pomodoro;
  const shortBreakTimer = user?.shortBreak;
  const longBreakTimer = user?.longBreak;

  const selectedTimer = () => {
    switch (selectedButton) {
      case 'pomodoro':
        return pomodoroTimer;
      case 'shortBreak':
        return shortBreakTimer;
      case 'longBreak':
        return longBreakTimer;
      default:
        return 25; // Default to 25 minutes if no matching case
    }
  };

  useEffect(() => {
    setTimer(selectedTimer() * 60); // Convert timer to seconds
  }, [selectedButton, pomodoroTimer, shortBreakTimer, longBreakTimer]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timerRunning && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timerRunning && timer === 0) {
      setTimerRunning(false);

      // Logic to switch to the next timer based on the current selectedButton
      switch (selectedButton) {
        case 'pomodoro':
          setPomos(pomos + 1);
          setSelectedButton('shortBreak');
          setTimer(shortBreakTimer * 60);
          toast.success('Pomodoro completed! Switched to Short Break.');
          break;
        case 'shortBreak':
          setSelectedButton('pomodoro');
          setTimer(pomodoroTimer * 60);
          toast.success('Short Break completed! Switched to Pomodoro.');
          break;
        // Add similar cases for other timer types if needed
        default:
          break;
      }

      setFinishAt('Not started');
      setTimerRunning(false);
      // Optionally, you can automatically start the new timer
      // startTimer();
    }
  
    return () => clearInterval(intervalId);
  }, [timerRunning, timer, selectedButton, pomodoroTimer, shortBreakTimer]);

  // Function to calculate the finish time based on the selected timer
  const calculateFinishTime = (timerType: string): string => {
    const now = new Date();
    const timerDuration = selectedTimer() * 60 * 1000; // Convert timer to milliseconds
    const finishTime = new Date(now.getTime() + timerDuration);

    const finishHours = finishTime.getHours().toString().padStart(2, '0');
    const finishMinutes = finishTime.getMinutes().toString().padStart(2, '0');

    return `${finishHours}:${finishMinutes} (${(timerDuration / (60 * 1000)).toFixed(1)}h)`;
  };

  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') onClose();
  };

  const handleButtonClick = (buttonType: string) => {
    setSelectedButton(buttonType);
    setFinishAt('Not started');
    setTimerRunning(false);
  };

  const startTimer = () => {
    setTimerRunning(true);
    toast.success('Timer Started!');
    setFinishAt(calculateFinishTime(selectedButton)); // Update finishAt when a timer is started
  };

  const stopTimer = () => {
    setTimerRunning(false);
    toast.success('Timer Stopped!');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[600px] flex flex-col">
        <div className="bg-white p-6 rounded-[5px] border-crush-it-blue border-2">
          <nav className="flex justify-between">
            <button
              className={`font-bold ${selectedButton === 'pomodoro' ? 'text-crush-it-blue' : 'text-black'} ${selectedButton === 'pomodoro' ? 'border-b-2 border-crush-it-blue' : ''}`}
              onClick={() => handleButtonClick('pomodoro')}
            >
              Pomodoro
            </button>
            <button
              className={`font-bold ${selectedButton === 'shortBreak' ? 'text-crush-it-blue' : 'text-black'} ${selectedButton === 'shortBreak' ? 'border-b-2 border-crush-it-blue' : ''}`}
              onClick={() => handleButtonClick('shortBreak')}
            >
              Short Break
            </button>
            <button
              className={`font-bold ${selectedButton === 'longBreak' ? 'text-crush-it-blue' : 'text-black'} ${selectedButton === 'longBreak' ? 'border-b-2 border-crush-it-blue' : ''}`}
              onClick={() => handleButtonClick('longBreak')}
            >
              Long Break
            </button>
            <button onClick={onClose}>
              <Image src={CloseIcon} alt="Close Icon" />
            </button>
          </nav>
          <div className='w-[540px] h-[255px] bg-crush-it-grey rounded-[8px] mt-4'>
            <h1 className="text-[100px] font-bold text-center">
              {`${Math.floor(timer / 60)
                .toString()
                .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
            </h1>
            <div className="flex justify-center mt-4">
              <button
                className="bg-crush-it-blue text-white font-bold text-[18px] px-4 py-2 w-[158px] h-[54px] rounded-[16px]"
                onClick={timerRunning ? stopTimer : startTimer}
              >
                {timerRunning ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
          <h1 className='font-bold text-black text-[20px]'>
            Assign Leader for Task 1
          </h1>
          <div className="w-[540px] h-[109px] rounded-[8px] bg-crush-it-grey p-4 mt-2">
            <div className="flex justify-between">
              <label className="font-bold text-crush-it-blue text-[16px]"> Notes: </label>
              <button className='' onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <div className="relative flex items-center justify-center">
                    <Image src={blueRectangle} alt="Background" className="w-full h-auto" />
                    <Image src={CheckIcon} alt="Foreground" className="absolute w-2/4 h-auto" />
                  </div> : <Image src={PencilIcon} alt="Pencil Icon For Notes" />}
              </button>
            </div>
            <textarea
              className="w-[500px] h-[40px] leading-[18px] text-[14px] text-crush-it-text-black font-medium p-1 bg-inherit mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              readOnly={!isEditing}
              required
            />
          </div>
          <div className='flex bg-crush-it-black w-[540px] h-[70px] rounded-[8px] border-[1px] border-crush-it-blue mt-2 p-4 items-center justify-center'>
            <p className="font-bold text-white text-[20px] leading-[25px]"> Pomos: </p>
            <p className="font-bold text-[#407BFF] text-[20px] leading-[25px] ml-2"> {`${pomos}/${maxPomos}`} </p>
            <p className="font-bold text-white text-[20px] leading-[25px] ml-8"> Finish At: </p>
            <p className="font-bold text-[#407BFF] text-[20px] leading-[25px] ml-2"> {finishAt} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
