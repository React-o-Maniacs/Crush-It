import React, { useState, useRef, useEffect } from 'react';
import ArrowHollowIcon from '../public/images/arrow-hollow.svg';
import Image from 'next/image';

interface DropdownProps {
  defaultLabel: string;
  options: string[];
  onSelect: (selectedOption: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ defaultLabel, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-1" ref={dropdownRef}>
      <button
        className="flex flex-1 rounded-[10px] border border-crush-it-blue p-3 text-left"
        onClick={toggleDropdown}
      >
        {selectedOption || defaultLabel}
        <Image className='flex scale-125 ml-2 self-center' src={ArrowHollowIcon} alt="Arrow Hollow Icon" />
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-crush-it-blue shadow-md z-10 rounded-[5px] p-2">
          <ul>
            {options.map((option) => (
              <li
                key={option}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
