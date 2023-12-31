import React, { useState, useRef, useEffect } from 'react';
import ArrowHollowIcon from '../public/images/arrow-hollow.svg';
import Image from 'next/image';

interface DropdownProps {
  options: string[];
  onChange: (selectedValue: string) => void;
  widthStyle?: string;
  selectedOption: string; // New prop to control the selected option
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange, widthStyle, selectedOption: propSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(propSelectedOption || options[0]); // Set the initial value
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

  useEffect(() => {
    setSelectedOption(propSelectedOption || options[0]); // Update the selected option when prop changes
  }, [propSelectedOption, options]);

  const handleOptionChange = (event: React.MouseEvent<HTMLLIElement>) => {
    const newSelectedOption = event.currentTarget.textContent || '';
    setSelectedOption(newSelectedOption);
    setIsOpen(false);
    onChange(newSelectedOption);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center rounded-[10px] border border-crush-it-blue p-2 px-3 text-left text-[22px] font-bold ${widthStyle}`}
        onClick={toggleDropdown}
      >
        <span className="flex-1">{selectedOption}</span>
        <Image
          className={`scale-125 transition-transform transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          src={ArrowHollowIcon}
          alt="Arrow Hollow Icon"
        />
      </button>
      
      {isOpen && (
        <div className={`absolute bg-white border border-crush-it-blue shadow-md z-10 rounded-[5px] p-2 ${options.length > 5 ? 'max-h-72 overflow-y-scroll custom-scrollbar w-full' : 'w-full'}`}>
          <ul>
            {options.map((option) => (
              <li
                key={option}
                className="cursor-pointer p-2 hover:bg-crush-it-blue rounded-[5px]"
                onClick={handleOptionChange}
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
