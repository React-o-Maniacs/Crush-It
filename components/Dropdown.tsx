import React, { useState, useRef, useEffect } from 'react';
import ArrowIcon from '../public/images/arrow.svg';
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
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex w-full py-2 px-4 bg-gray-200 rounded border border-gray-300 text-left"
        onClick={toggleDropdown}
      >
        {selectedOption || defaultLabel}
        <Image className='scale-150' src={ArrowIcon} alt="Arrow Icon" />
      </button>
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 shadow-md z-10">
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
