import React from 'react';

interface Option {
    value: string;
    role: string;
}

interface SelectInputProps {
    label: string;
    htmlFor: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    required?: boolean;
}

const SecondarySelectInput: React.FC<SelectInputProps> = ({
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
        <div className={`mb-4 ${className}`}>
            <label htmlFor={htmlFor} className="block text-white font-bold mb-2">
                {label}
            </label>
            <div className='bg-gray-800 text-white py-1 rounded-md pr-2'>
                <select
                    id={htmlFor}
                    name={htmlFor}
                    value={value}
                    onChange={handleChange}
                    className="w-full border-none text-gray-400 bg-gray-800 px-2 shadow-sm"
                    required={required}
                >
                    <option value="">{label}</option>
                    {options.map(option => (
                        <option key={option.value} className='text-white' value={option.value}>
                            {option.role}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SecondarySelectInput;
