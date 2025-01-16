import React, { ReactNode } from 'react';

interface SelectInputProps {
    label: string;
    htmlFor: string;
    value: any;
    onChange: (value: any) => void;
    options: any[];
    className?: string;
    required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    htmlFor,
    value,
    onChange,
    options,
    className = '',
    required = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`mb-4 ${className} `}>
            <label htmlFor={htmlFor} className="block text-white font-bold mb-2 ">{label} <span className='text-primary'>{required?"*":""}</span></label>
            <div className='bg-gray-800 text-white  py-1 rounded-md pr-2 '>
                <select
                    id={htmlFor}
                    name={htmlFor}
                    value={value}
                    onChange={handleChange}
                    className="w-full border-none text-white bg-gray-800  px-2 capitalize shadow-sm "
                    required={required}
                >
                    <option value="">{label}</option>
                    {options.map(option => (
                        <option key={option.value} className=' text-white  ' value={option.uid}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectInput;
