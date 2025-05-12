'use client';

import HeaderTable from "@/components/headers/header.table";
import { HeaderTile } from "@/components/headers/header.tile";
import NavBar from "@/components/nav/navbar";
import TableRow from "@/components/tiles/tile.table-row";
import conf from "@/lib/conf/conf";
import { BrLogTableHeaderData } from "@/lib/data/br-wlms/data.log-page.header";
import { Titles } from "@/lib/data/title";
import myIntercepter from "@/lib/interceptor";
import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";

interface Log {
  s_no: any;
  uid: string;
  device_uid: string;
  battery: number;
  level: any;
  wl_msl: any;
  device_status: boolean;
  sensor_status: boolean;
  created_at: string;
  time: any;
  date: any;
  is_online: any;
}

interface Device {
  uid: string;
  river_name: string;
  bridge_no: string;
  device_logs: Log[];
}

const getDateRange = (selectedDate: any) => {
  const startDate = new Date(selectedDate);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 3);

  const endDate = new Date(selectedDate);
  endDate.setHours(23, 59, 59, 999);
  endDate.setDate(endDate.getDate() + 1);


  return { start: startDate, end: endDate };
};


// Fetch data function
const fetchLog = async (id: string): Promise<Device> => {


  try {


    const dates = getDateRange(Date.now());

    const res = await myIntercepter.get(`${conf.BR_WLMS}/api/logs/${id}`, {
      params: dates
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch log');
  }
};


// Page component
const LogDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [logs, setLogs] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const data = await fetchLog(id);
          setLogs(data);
        } else {
          setError('Invalid ID');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to load log data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);


  const columns = [
    { name: 'S. No.', key: "s_no", className: "text-start" },
    { name: 'S. No.', key: "battery", className: "text-start" },
    { name: 'S. No.', key: "level", className: "text-start" },
    { name: 'S. No.', key: "wl_msl", className: "text-start" },
    { name: 'S. No.', key: "time", className: "text-center" },
    { name: 'S. No.', key: "date", className: "text-center" },
    { name: 'S. No.', key: "is_online", className: "" },
    { name: 'S. No.', key: "sensor_status", className: "" },
    { name: 'S. No.', key: "remark", className: " text-xs" },
  ]

  return (
    <div className=" grid h-[calc(100vh)] w-screen grid-rows-[auto_auto_1fr]">
      <NavBar disableMenuBar={true} title={Titles.BrWlmsTitle} />
      <HeaderTile title={`LOGS / ${logs?.river_name} (${logs?.bridge_no})`} actions={[
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />
      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <HeaderTable columns={BrLogTableHeaderData} />
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.device_logs.length > 0 ? (
              logs.device_logs.map((log: Log, index) => {
                const formattedLog = {
                  ...log,
                  s_no: index + 1,
                  level: log.sensor_status ? log.level : "--:--",
                  wl_msl: log.sensor_status ? log.wl_msl : "--:--",
                  date: new Date(log.created_at).toLocaleDateString(),
                  time : new Date(log.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  }),
                  is_online: log.device_status
                }
                return (
                  <TableRow data={formattedLog} columns={columns} />
                )
              })
            ) : (
              <div className='text-white text-center'>No logs available</div>
            )}
          </div>
        )}
      </div>
    </div>

  );
};

export default LogDetails;
