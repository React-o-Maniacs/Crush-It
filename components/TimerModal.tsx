import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import CloseIcon from '../public/images/close-circle.svg';
import PencilIcon from "../public/images/pencil.svg";
import Image from 'next/image';

interface TimerModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ isVisible, onClose }) => {
  const [selectedButton, setSelectedButton] = useState<string>('pomodoro');
  const [notes, setNotes] = useState<string>('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pomos, setPomos] = useState<string>('0/3');
  const [finishAt, setFinishAt] = useState<string>('19:53 (1.4h)');

  if (!isVisible) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    if (target.id === 'wrapper') onClose();
  };

  const handleButtonClick = (buttonType: string) => {
    setSelectedButton(buttonType);
    // Add logic to handle button click if needed
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
          <div className='w-[540px] h-[254px] bg-crush-it-grey rounded-[8px] mt-4'>
            <h1 className="text-[100px] font-bold text-center">25:00</h1>
            <div className="flex justify-center mt-4">
              <button
                className="bg-crush-it-blue text-white font-bold text-[18px] px-4 py-2 w-[158px] h-[54px] rounded-[16px]"
                onClick={() => toast.success('Timer Started!')}
              >
                Start
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
                <Image src={PencilIcon} alt="Pencil Icon For Notes" />
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
            <p className="font-bold text-[#407BFF] text-[20px] leading-[25px] ml-2"> {pomos} </p>
            <p className="font-bold text-white text-[20px] leading-[25px] ml-8"> Finish At: </p>
            <p className="font-bold text-[#407BFF] text-[20px] leading-[25px] ml-2"> {finishAt} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;