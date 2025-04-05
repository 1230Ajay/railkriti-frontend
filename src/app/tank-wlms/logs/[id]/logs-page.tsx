'use client';

import NavBar from "@/components/nav/navbar";
import conf from "@/lib/conf/conf";

import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import myIntercepter from "@/lib/interceptor";
import { Titles } from "@/lib/data/title";
import { HeaderTile } from "@/components/headers/header.tile";
import HeaderTable from "@/components/headers/header.table";
import { TankWLMSLogTableHeaderData } from "@/lib/data/tn-wlms/data.log-page.header";
import TableRow from "@/components/tiles/tile.table-row";

interface Log {
  s_no: any;
  is_online: boolean;
  tank_level: any;
  uid: string;
  device_uid: string;
  battery: number;
  level: number;
  wl_msl: number;
  sensor_status: boolean;
  created_at: string;
  time: string;
  date: string;
}

interface Device {
  uid: string;
  location: string;

  km: string;
}

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 1)
// Get the date from three days ago
const threeDaysAgo = new Date();
threeDaysAgo.setDate(currentDate.getDate() - 3);

// Format the dates to ISO format
const fromDate = threeDaysAgo.toISOString();
const toDate = currentDate.toISOString();



// Page component
const LogDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [logs, setLogs] = useState<Log[] | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
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

  // Fetch data function
  const fetchLog = async (id: string) => {
    try {
      const res = await myIntercepter.get(`${conf.TANK_WLMS}/api/logs/${id}`, { params: { fromDate: fromDate, toDate: toDate } });
      await setDevice(res.data);
      return res.data.device_logs;
    } catch (error) {
      return [];
    }
  };

  const columns = [
    { name: 'S. No.', key: "s_no", className: "text-start" },
    { name: 'S. No.', key: "battery", className: "text-start" },
    { name: 'S. No.', key: "tank_level", className: "text-start" },
    { name: 'S. No.', key: "time", className: "text-center" },
    { name: 'S. No.', key: "date", className: "text-center" },
    { name: 'S. No.', key: "is_online", className: "" },
    { name: 'S. No.', key: "sensor_status", className: "" },
  ]

  return (
    <div className=" grid h-screen w-screen grid-rows-[auto_auto_1fr]">

      <NavBar title={Titles.TankWlmsTitle} disableMenuBar={true} ></NavBar>

      <HeaderTile title={`LOGS / ${device?.location} (${device?.km})`} actions={[

        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <HeaderTable columns={TankWLMSLogTableHeaderData} />
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => {

                const formattedLog = {
                  ...log,
                  s_no:index+1,
                  sensor_status : log.is_online && log.sensor_status,
                  date : new Date(log.created_at).toLocaleDateString('en-IN',{hour12:false}),
                  time : new Date(log.created_at).toLocaleTimeString('en-IN',{hour12:false})
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
