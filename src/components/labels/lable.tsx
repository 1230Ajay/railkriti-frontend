import React from 'react';

interface LabelTextFieldProps {
    label: string;
    htmlFor: string;
}

const LabelTextField: React.FC<LabelTextFieldProps> = ({ label, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className="block text-white font-bold mb-2">
            {label}
        </label>
    );
};

export default LabelTextField;
