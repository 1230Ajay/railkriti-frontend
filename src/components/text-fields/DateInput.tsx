import React from 'react';

interface DateInputProps {
    label: string;
    htmlFor: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
    label,
    htmlFor,
    value,
    onChange,
    className = '',
    required = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={htmlFor} className="block text-white font-bold mb-2">{label} <span className='text-primary'>{required?"*":""}</span></label>
            <input
                type="date"
                id={htmlFor}
                name={htmlFor}
                value={value}
                onChange={handleChange}
                className="w-full text-white  rounded-md shadow-sm py-1 px-2 bg-gray-800 date-input-white-icon"
                
                required={required}
            />
        </div>
    );
};

export default DateInput;
