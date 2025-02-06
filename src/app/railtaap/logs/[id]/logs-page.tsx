'use client';

import NavBar from "@/components/nav/navbar";
import conf from "@/conf/conf";

import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import myIntercepter from "@/lib/interceptor";
import { Titles } from "@/lib/data/title";

interface Log {
  temp: any;
  uid: string;
  device_uid: string;
  battery: number;
  level: number;
  wl_msl: number;
  device_status: boolean;
  sensor_status: boolean;
  created_at: string;
}

interface Device {
  uid: string;
  river_name: string;
  bridge_no: string;
  device_logs: Log[];
}

const currentDate = new Date();

currentDate.setDate(currentDate.getDate()+1);

// Get the date from three days ago
const threeDaysAgo = new Date();
threeDaysAgo.setDate(currentDate.getDate() - 3);

// Format the dates to ISO format
const fromDate = threeDaysAgo.toISOString();
const toDate = currentDate.toISOString();

// Fetch data function
const fetchLog = async (id: string) => {
  try {
    const res = await myIntercepter.get(`${conf.RAILTAAP}/api/logs/${id}`, {params: {start: fromDate, end: toDate }});
    
    return res.data.device_logs;
  } catch (error) {
    return [];
  }
};

// Page component
const LogDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [logs, setLogs] = useState<Log[] | null>(null);
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



  return (
    <div className=" grid h-screen w-screen grid-rows-[auto_auto_1fr]">
      <NavBar title={Titles.RailtaapTitle} disableMenuBar={true} />
      <div className='flex justify-between rounded-t-md mx-4 mt-4 bg-black items-center px-4'>
        <h2 className='font-bold text-white py-4 uppercase text-2xl flex items-center'>Logs <div className="ml-2 "> </div></h2>
        <div className='space-x-4 items-center hidden lg:flex'>

          <div className='flex rounded-md space-x-4 w-fit text-white justify-center items-center'>
            <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
            <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
            <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
          </div>
        </div>
      </div>

      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <div className='border-b-2 border-t-2 capitalize text-white grid grid-cols-7  py-2 text-center min-w-[780px]'>
          <p>Sr. No</p>
          <p>Battery</p>
          <p>Temp</p>
      
          <p>Time</p>
          <p>Date</p>
          <p>Device Status</p>
          <p>Sensor</p>
        </div>
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  className='text-xs md:text-base grid grid-cols-7 border-b border-gray-600 items-center py-1 text-center'
                  key={log.uid}
                >
                  <div>{index + 1}</div>
                  <div>{log.battery}%</div>
                  <div>{log.temp}°C</div>
                  <div>{new Date(log.created_at).toLocaleTimeString('en-GB')}</div>
                  <div>{new Date(log.created_at).toLocaleDateString()}</div>
                  <div className="flex justify-center">
                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.device_status ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {log.device_status ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.sensor_status && log.device_status ? 'bg-green-600 text-white ' : 'bg-red-600 text-white'}`}>
                      {log.sensor_status && log.device_status ? "ON" : "OFF"}
                    </p>
                  </div>
                </div>
              ))
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
