import React, { useEffect, useRef, useState } from "react";

interface MultiSelectInputDTO {
    label: string;
    htmlFor: string;
    value: string[];
    onChange: (selected: string[]) => void;
    options: { uid: string; name: string; alloted: boolean }[];
}

const MultiSelectInput: React.FC<MultiSelectInputDTO> = ({ label, htmlFor, value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (uid: string) => {
        let updatedSelection;
        if (value.includes(uid)) {
            updatedSelection = value.filter((selected) => selected !== uid);
        } else {
            updatedSelection = [...value, uid];
        }
        onChange(updatedSelection);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label htmlFor={htmlFor} className="font-semibold mb-1   block">{label}</label>
            <div
                className="bg-gray-800 text-white pl-3  py-1 rounded-md pr-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value.length > 0 ? (
                    value.length < 3 ? (
                        options
                            .filter(option => value.includes(option.uid))
                            .map(opt => opt.name)
                            .join(", ")
                    ) : (
                        <span className="flex items-center">
                            {options
                                .filter(option => value.includes(option.uid))
                                .slice(0, 2)
                                .map(opt => opt.name)
                                .join(", ")}
                            <span className="text-gray-500 ml-1">and more</span>
                        </span>
                    )
                ) : (
                    "Select Sections"
                )}
            </div>

            {isOpen && (
                <div className="w-full border-none rounded-md mt-3 text-white bg-gray-800  px-2 capitalize shadow-sm ">
                    {options.map((option) => (
                        <label key={option.uid} className="flex items-center space-x-2 p-2 hover:bg-gray-800 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value.includes(option.uid)}
                                onChange={() => handleCheckboxChange(option.uid)}
                            />
                            <span>{option.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectInput;

