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
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type,
  image,
  alt
}) => {
  return (
    <>
      <div className='flex'>
        <Image className='rounded-[1.5px] h-6 mr-2' src={image} alt={alt} />
        <label className='text-gray-700 font-size: 0.875rem font-normal' htmlFor={id}>{label}</label>
      </div>
      <div>
        <input className='outline-crush-it-blue rounded hover:rounded-[1px] border border-gray-300 bg-white'
          id={id}
          onChange={onChange}
          value={value}
          type={type}
          placeholder=" " />
      </div>
    </>
  )
}

export default Input;