import React from 'react';
import { IconType } from 'react-icons';

interface PrimaryButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?:any;
}

interface IconButtonProps {
  icon: IconType;
  name: string;
  onClick: () => void;
  className?: string;
  type?:String;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children=<p></p>, onClick = ()=>{}, className = '' ,type ='button'}) => {
  return (
    <button
      type={type}
      className={`bg-primary px-4 rounded-sm h-fit py-1 text-white font-semibold ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, name, onClick, className }) => {
  return (
    <button
      className={` px-4 rounded-sm h-full py-2 w-full hover:bg-primary text-white font-semibold flex items-center ${className}`}
      onClick={onClick}
    >
      <Icon className='text-2xl mr-3 text-gray-400' />
      {name}
    </button>
  );
};

export { PrimaryButton, IconButton };
