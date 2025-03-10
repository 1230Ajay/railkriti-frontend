import React from "react";

interface TableRowPropsV2 {
    active_uid:string;
    data: Record<string, any>;
    columns: { name: string; key: string; className?: string }[];
    actions?: { icon: React.ReactNode; onClick: () => void; className?: string }[];
    activeContainer:React.ReactNode;
}

const TableRowV2: React.FC<TableRowPropsV2> = ({ data, columns, actions , active_uid , activeContainer }) => {
    const totalColumns = columns.length + (actions ? actions.length : 0);
    return (
        <>
            <div className={`grid grid-cols-${totalColumns} text-center min-w-[720px] text-xs md:text-base grid grid-cols-10  border-b border-gray-600 items-center py-2`}>
                {columns.map((col, index) => (
                    <p key={index} className={col.className || ""}>
                        {col.key === "is_online" ? (
                            <span className={`px-4 py-1 rounded-full uppercase  ${data[col.key] ? "bg-green-500 font-bold" : "bg-red-500 font-bold"}`}>
                                {data[col.key] ? "Online" : "Offline"}
                            </span>
                        ) : col.key === "sensor_status" ? (
                            <span className={` px-4 py-1 rounded-full  uppercase ${data[col.key] ? "bg-green-500 font-bold" : "bg-red-500 font-bold"}`}>
                                {data[col.key] ? "OK" : "Error"}
                            </span>
                        ) : (
                            data[col.key]
                        )}
                    </p>
                ))}

                {actions &&
                    actions.map((action, index) => (
                        <p key={index} className={`flex justify-center w-full `}>
                            <button className={`${action.className || ""}`} onClick={action.onClick}>{action.icon}</button>
                        </p>
                    ))}


            </div>
            {data.uid === active_uid ? <div className=" w-full">
                {activeContainer}
            </div> : null}
        </>
    );
};

export default TableRowV2;
