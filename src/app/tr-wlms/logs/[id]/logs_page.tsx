'use client';

import HeaderTable from "@/components/headers/header.table";
import { HeaderTile } from "@/components/headers/header.tile";
import NavBar from "@/components/nav/navbar";
import TableRow from "@/components/tiles/tile.table-row";
import conf from "@/lib/conf/conf";
import { Titles } from "@/lib/data/title";
import { TRLogTableHeaderData } from "@/lib/data/tr-wlms/data.log-page.header";
import myInterceptor from "@/lib/interceptor";
import axios from "axios";

import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";

interface Log {
  s_no: any;
  bottom_sensor_state: any;
  top_sensor_state: any;
  device_status: any;
  battery: any;
  uid: string;
  device_uid: string;
  time: any;
  date: any;
  created_at: string;
}

interface Device {

  uid: string;
  location: string;
  km: string;
  device_logs: Log[];
}

// Fetch data function
const fetchLog = async (id: string): Promise<Device> => {
  try {
    const res = await myInterceptor.get(`${conf.TR_WLMS}/api/logs/${id}`);
    console.log(res.data)
    return res.data;
    console.log(res.data)
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch log');
  }
};



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
          setLogs(data.device_logs);
          setDevice(data);
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
    { name: '', key: "s_no", className: "text-start" },
    { name: '', key: "battery", className: "text-start" },
    { name: '', key: "time", className: "text-center" },
    { name: '', key: "date", className: "text-center" },
    { name: '', key: "is_online", className: "" },
  ]


  return (
    <div className="  grid h-[calc(100vh)] w-screen grid-rows-[auto_auto_1fr]  ">
      <NavBar disableMenuBar={true} title={Titles.TrWlmsTitle} />
      <HeaderTile title={`LOGS ${device?.location} (${device?.km})`} actions={[{ icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
      { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
      { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },]} />

      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <HeaderTable columns={TRLogTableHeaderData} />
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => {
                const formattedLog = {
                  s_no : index + 1,
                  battery:`${log.battery}%`,
                  is_online:log.device_status,
                  time : new Date(log.created_at).toLocaleTimeString('en-IN',{hour12:false}),
                  date : new Date(log.created_at).toLocaleDateString('en-IN',{hour12:false}),
                }
                return (
                  <TableRow data={formattedLog} columns={columns} actions={[
                    {
                      icon: <>{log.bottom_sensor_state?"Alert":"OK"}</>,
                      onClick: () => { },
                      className: ` ${log.bottom_sensor_state ? 'bg-red-500' : 'bg-green-500'} w-20 rounded-full font-bold py-[3px]`
                    },
                    {
                      icon: <>{log.top_sensor_state?"Alert":"OK"}</>,
                      onClick: () => { },
                      className: ` ${log.top_sensor_state ? 'bg-red-500' : 'bg-green-500'} w-20 rounded-full font-bold py-[3px]`
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
