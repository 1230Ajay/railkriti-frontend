import React from "react";

interface TableRowProps {
  data: Record<string, any>;
  columns: { name: string; key: string; className?: string }[];
  actions?: { icon: React.ReactNode; onClick: () => void; className?: string }[];
}

const TableRow: React.FC<TableRowProps> = ({ data, columns, actions }) => {
  const totalColumns = columns.length + (actions ? actions.length : 0);

  return (
    <div
      className="grid text-center min-w-[720px] text-xs md:text-base border-b border-gray-600 items-center p-2"
      style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }} // Dynamic columns
    >
      {columns.map((col, index) => (
        <p key={index} className={` ${col.className || ""}`}>
          {col.key === "is_online" ? (
            <span className={`px-4 py-1 rounded-full uppercase font-bold ${data[col.key] ? "bg-green-500" : "bg-red-500"}`}>
              {data[col.key] ? "Online" : "Offline"}
            </span>
          ) : col.key === "sensor_status" ? (
            <span className={`px-4 py-1 rounded-full uppercase font-bold ${data[col.key] ? "bg-green-500" : "bg-red-500"}`}>
              {data[col.key] ? "OK" : "Error"}
            </span>
          ) : (
            data[col.key]
          )}
        </p>
      ))}

      {actions &&
        actions.map((action, index) => (
          <p key={`action-${index}`} className="flex justify-center w-full">
            <button className={`${action.className || ""}`} onClick={action.onClick}>
              {action.icon}
            </button>
          </p>
        ))}
    </div>
  );
};

export default TableRow;
