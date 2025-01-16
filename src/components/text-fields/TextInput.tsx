import React from 'react';

interface TextInputProps {
    label: string;
    htmlFor: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    placeHolder?: string;
    error?: string; // Added error prop
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    htmlFor,
    type = 'text',
    value,
    onChange,
    className = '',
    required = false,
    disabled = false,
    placeHolder = '',
    error // Added error prop
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={htmlFor} className="block text-white font-bold mb-2">
                {label} <span className='text-primary'>{required?"*":""}</span>
            </label>
            <input
                type={type}
                id={htmlFor}
                name={htmlFor}
                value={value}
                placeholder={placeHolder || label}
                onChange={handleChange}
                className={`w-full py-1 px-2 bg-gray-800  text-white rounded-md shadow-sm ${disabled ? 'cursor-not-allowed' : ''}`}
                required={required}
                disabled={disabled}
                autoComplete="off"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>} {/* Display error message */}
        </div>
    );
};

export default TextInput;
