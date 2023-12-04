import React from 'react';
import Image from 'next/image';

interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
  image?: any;
  alt: string;
  inputFieldClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type,
  image,
  alt,
  inputFieldClassName,
  labelClassName
}) => {
  return (
    <div className='flex flex-col gap-y-5'>
      <div className='flex'>
        <Image className='rounded-[1.5px] mr-2 scale-125' src={image} alt={alt} />
        <label className={`text-gray-700 text-2xl font-normal ${labelClassName}`} htmlFor={id}>{label}</label>
      </div>
      <div className='flex'>
        <input className={`outline-crush-it-blue rounded-[12px] border border-gray-300 bg-white w-[566px] h-[56px] p-[16px] ${inputFieldClassName}`}          id={id}
          onChange={onChange}
          value={value}
          type={type}
          placeholder=" " />
      </div>
    </div>
  )
}

export default Input;