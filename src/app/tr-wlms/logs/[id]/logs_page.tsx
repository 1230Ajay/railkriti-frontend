'use client';

import NavBar from "@/components/nav/navbar";
import conf from "@/conf/conf";
import axios from "axios";

import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";

interface Log {
  bottom_sensor_state: any;
  top_sensor_state: any;
  device_status: any;
  battery: any;
  uid: string;
  device_uid: string;

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
    const res = await axios.get(`${conf.TR_WLMS}/api/logs/${id}`);
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

  const title =[
    { short: 'Tr', full: 'ack' },
    { short: 'W', full: 'ater' },
    { short: 'L', full: 'ogging' },
    { short: 'M', full: 'onitering' },
    { short: 'S', full: 'ystem' },
  ];

  return (
    <div className=" grid h-screen w-screen grid-rows-[auto_auto_1fr]  ">
      <NavBar title={title} disableMenuBar={true} />
      <div className='flex justify-between rounded-t-md mx-4 mt-4 bg-black items-center px-4'>
        <h2 className='font-bold text-white py-4 uppercase text-2xl flex items-center'>Logs <div className="ml-2 "> / {logs?.location} [{logs?.km}]</div></h2>
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
          <p>Time</p>
          <p>Date</p>

          <p>Bottom</p>
          <p>top</p>
          <p>Device Status</p>

        </div>
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.device_logs.length > 0 ? (
              logs.device_logs.map((log, index) => (
                <div
                  className='text-xs md:text-base grid grid-cols-7 border-b border-gray-600 items-center py-1 text-center'
                  key={log.uid}
                >
                  <div>{index + 1}</div>
                  <div>{log.battery}%</div>
               

                  <div>{new Date(log.created_at).toLocaleTimeString('en-GB')}</div>
                  <div>{new Date(log.created_at).toLocaleDateString()}</div>
                  
             
                  
                  <div className="flex justify-center">
                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.bottom_sensor_state  ? 'bg-primary text-white ' : 'bg-green-600 text-white'}`}>
                      {log.bottom_sensor_state ? "Alert" : "OK"}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.top_sensor_state  ? 'bg-primary text-white ' : 'bg-green-600 text-white'}`}>
                      {log.top_sensor_state? "High Alert" : "OK"}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${log.device_status ? 'bg-green-600 text-white' : 'bg-primary text-white'}`}>
                      {log.device_status ? 'Online' : 'Offline'}
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
