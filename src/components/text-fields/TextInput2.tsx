
interface TextInputProps {
    label: string;
    value: string;
    onChange: any;
    className?: string;
    type?: string;
    onBlur?:any;
    required?: boolean;
    disabled?: boolean;
    placeHolder?: string;
    name?:string;
    error?: string; 
}

const TextInput2: React.FC<TextInputProps> = ({
    label,
    name="",
    type = 'text',
    value,
    onChange,
    onBlur,
    className = '',
    required = false,
    disabled = false,
    placeHolder = '',
    error =""
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label htmlFor={label} className="block text-white font-bold mb-2">
                {label} <span className='text-primary'>{required?"*":""}</span>
            </label>
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeHolder || label}
                onChange={onChange}
                className={`w-full py-1 px-2 bg-gray-800  text-white rounded-md shadow-sm ${disabled ? 'cursor-not-allowed' : ''}`}
                required={required}
                onBlur={onBlur}
                disabled={disabled}
            />
            {error !=="" && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default TextInput2;