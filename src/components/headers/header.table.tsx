import React from "react";

interface HeaderTableProps {
  columns: {
    name: string;
    className?: string;
  }[];
}

const HeaderTable: React.FC<HeaderTableProps> = ({ columns }) => {
  return (
    <div
      className="grid text-white font-bold min-w-[720px] bg-black text-center border-y-2 text-xs md:text-base capitalize items-center p-2"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }} // Dynamic column count
    >
      {columns.map((column, index) => (
        <p key={index} className={column.className || ""}>
          {column.name}
        </p>
      ))}
    </div>
  );
};

export default HeaderTable;
