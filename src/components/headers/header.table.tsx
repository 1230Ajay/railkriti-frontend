import { Columns } from 'lucide-react'
import React from 'react'

interface HeaderTableProps {
    columns: {
        name: string,
        className: string
    }[]
}

function HeaderTable(props: HeaderTableProps) {
    return (
        <div className={`grid grid-cols-${props.columns.length}   text-white font-bold   min-w-[720px] bg-black   text-center border-y-2   text-xs md:text-base capitalize items-center pb-2 py-2`}>
            {
                props.columns.map((column) => <p className={`${column.className}`}> {column.name}</p>)
            }
        </div>
    )
}

export default HeaderTable


