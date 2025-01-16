import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TimeSelectorProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ label, selected, onChange, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-white font-bold mb-2">{label}</label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        className="w-full py-1 px-2 text-white bg-gray-800 rounded-md shadow-sm"
      />
    </div>
  );
};

export default TimeSelector;
