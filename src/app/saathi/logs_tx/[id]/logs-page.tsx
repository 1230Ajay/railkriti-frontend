'use client';

import NavBar from "@/components/nav/navbar";
import { FaTrainSubway } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import conf from "@/lib/conf/conf";
import myIntercepter from "@/lib/interceptor";
import { Titles } from "@/lib/data/title";
import HeaderTable from "@/components/headers/header.table";
import { SaathiTxLogTableHeaderData } from "@/lib/data/saathi/data.log-page-header-tx";
import { HeaderTile } from "@/components/headers/header.tile";
import TableRow from "@/components/tiles/tile.table-row";

interface Log {
  isTrainDetected: any;
  uid: string;
  device_uid: string;
  battery: number;
  level: number;
  wl_msl: number;
  is_online: boolean;
  sensor_status: boolean;
  created_at: string;
  s_no:any;
  date:string;
  time:string;
}

interface Device {
  uid: string;
  name: string;
}


const currentDate = new Date();

currentDate.setDate(currentDate.getDate() + 1);

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
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
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
  const fetchLog = async (id: string): Promise<Log[]> => {
    try {
      const res = await myIntercepter.get(`${conf.SAATHI_TX}/api/logs/${id}`, { params: { start: fromDate, end: toDate } });
      await setDevice(res.data);
      return res.data.device_logs;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch log');
    }
  };


  const columns = [
    { name: 'S. No.', key: "s_no", className: "text-start" },
    { name: 'S. No.', key: "battery", className: "text-start" },
    { name: 'S. No.', key: "time", className: "text-center" },
    { name: 'S. No.', key: "date", className: "text-center" },
    { name: 'S. No.', key: "is_online", className: "" },
    { name: 'S. No.', key: "sensor_status", className: "" },
    { name: 'S. No.', key: "isTrainDetected", className: "" },
    
  ]

  return (
    <div className=" grid h-screen w-screen grid-rows-[auto_auto_1fr]  ">
   <NavBar title={Titles.SaathiTitle} disableMenuBar={true} ></NavBar>
      <HeaderTile title={`LOGS / ${device?.name}`} actions={[

        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <HeaderTable columns={SaathiTxLogTableHeaderData}/>
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => {
                log.s_no = index + 1;
                log.sensor_status = log.is_online && log.sensor_status;
                log.date = new Date(log.created_at).toLocaleDateString()
                log.time = new Date(log.created_at).toLocaleTimeString()
                log.isTrainDetected = log.isTrainDetected &&  log.is_online ? "Train Detected":""
                return(
               <TableRow data={log} columns={columns} />
              )})
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
