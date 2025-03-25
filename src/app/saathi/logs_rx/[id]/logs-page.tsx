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
import { SaathiRxLogTableHeaderData } from "@/lib/data/saathi/data.log-page-header-rx";
import TableRow from "@/components/tiles/tile.table-row";

interface Log {
  hooter_status: boolean;
  actions: any;
  isTrainDetected: any;
  uid: string;
  device_uid: string;
  battery: number;
  level: number;
  wl_msl: number;
  device_status: boolean;
  sensor_status: boolean;
  created_at: string;
  date: string;
  time: string;
  s_no: any;
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
  const fetchLog = async (id: string): Promise<Log[]> => {
    try {
      const res = await myIntercepter.get(`${conf.SAATHI_RX}/api/logs/${id}`, { params: { start: fromDate, end: toDate } });
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
    { name: 'S. No.', key: "sensor_status", className: "" },
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
        <HeaderTable columns={SaathiRxLogTableHeaderData} />
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.length > 0 ? (
              logs.filter((log) => log.actions !== 'LOG').map((log, index) => {

                log.s_no = index + 1;
                log.date = new Date(log.created_at).toLocaleDateString()
                log.time = new Date(log.created_at).toLocaleTimeString()
                log.sensor_status = log.hooter_status && log.device_status;
                return (
                  <TableRow data={log} columns={columns} actions={[
                    {
                      icon: <div className=" mx-auto">
                        {log.actions === "ONLINE" || log.actions === "OFFLINE" ? <div className={` w-24 px-4  rounded-full font-bold  py-1  ${log.actions === "ONLINE" ? 'bg-green-600' : 'bg-primary'}`}> {log.actions} </div> : <div>{log.actions.replace(/_/g, " ")}</div>}
                      </div>,
                      onClick: () => { }
                    }
                  ]} />
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


{/* <div
className='text-xs md:text-base grid grid-cols-6 border-b border-gray-600 items-center py-1 text-center'
key={log.uid}
>
<div>{index + 1}</div>
<div>{log.battery}%</div>
<div>{new Date(log.created_at).toLocaleTimeString('en-GB')}</div>
<div>{new Date(log.created_at).toLocaleDateString()}</div>
<div className="flex justify-center">
  <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.hooter_status && log.actions != 'OFFLINE' ? 'bg-green-600 text-white ' : 'bg-red-600 text-white'}`}>
    {log.hooter_status && log.actions != 'OFFLINE' ? "ON" : "OFF"}
  </p>
</div>
<div className=" mx-auto">
  {log.actions === "ONLINE" || log.actions === "OFFLINE" ? <div className={` w-24 px-4  rounded-full font-bold  py-1  ${log.actions === "ONLINE" ? 'bg-green-600' : 'bg-primary'}`}> {log.actions} </div> : <div>{log.actions.replace(/_/g, " ")}</div>}
</div>
</div> */}