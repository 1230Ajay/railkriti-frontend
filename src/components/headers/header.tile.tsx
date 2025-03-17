import { useState } from "react";

export interface ActionButton {
  icon: JSX.Element;
  onClick: () => void;
}

interface HeaderTileProps {
  title: string;
  onSearchChange?: (query: string) => void;
  actions?: ActionButton[];
}

export function HeaderTile({ title, onSearchChange, actions }: HeaderTileProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) onSearchChange(query);
  };

  return (
    <div className="flex justify-between max-h-16 items-center mx-4 py-4 bg-black rounded-t-md mt-4 px-4">
      <h2 className="font-bold text-white text-xl uppercase">{title}</h2>

      <div className="flex-col  md:flex-row md:space-x-4 hidden md:flex">
        {onSearchChange && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-white px-4 py-1 my-2 rounded-sm text-primary w-full"
          />
        )}

        {actions && (
          <div className="flex space-x-4 pt-2 md:pt-0 text-white">
            {actions.map((action, index) => (
              <button key={index} onClick={action.onClick} className="p-1 rounded-sm">
                {action.icon}
              </button>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
