'use client';

import HeaderTable from "@/components/headers/header.table";
import { HeaderTile } from "@/components/headers/header.tile";
import NavBar from "@/components/nav/navbar";
import TableRow from "@/components/tiles/tile.table-row";
import conf from "@/lib/conf/conf";
import { Titles } from "@/lib/data/title";
import { VinimayLogTableHeaderData } from "@/lib/data/vinimay/data.log-page.header";
import myInterceptor from "@/lib/interceptor";
import axios from "axios";

import { useEffect, useState } from "react";
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";

interface Log {

  is_online: any;
  battery: any;
  uid: string;
  device_uid: string;
  message: string
  created_at: string;
  pn: any;
  date: string;
  time: string;
  s_no: any;
}

interface Device {

  uid: string;
  lc: string;
  km: string;
  device_logs: Log[];
}

// Fetch data function
const fetchLog = async (id: string): Promise<Device> => {
  try {
    const res = await myInterceptor.get(`${conf.VINIMAY_URL}/api/logs/${id}`);
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



  const columns = [
    { name: 'S. No.', key: "s_no", className: "text-start" },
    { name: 'S. No.', key: "date", className: "text-center" },
    { name: 'S. No.', key: "time", className: "text-center" },
    { name: 'S. No.', key: "button_pressed", className: "text-center" },
    { name: 'S. No.', key: "pn", className: "text-center" },
    { name: 'S. No.', key: "message", className: "text-center" },
    { name: 'S. No.', key: "is_online", className: "" }
  ]

  return (
    <div className=" grid h-screen w-screen grid-rows-[auto_auto_1fr]  ">
      <NavBar disableMenuBar={true} title={Titles.VinimayTitle} />
      <HeaderTile title={`LOGS ${logs?.lc} (${logs?.km})`} actions={[{ icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
      { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
      { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },]} />
      <div className='overflow-scroll px-4 mx-4 rounded-b-md mb-4 bg-black no-scrollbar '>
        <HeaderTable columns={VinimayLogTableHeaderData} />
        {loading ? (
          <div className='text-white text-center'>Loading...</div>
        ) : error ? (
          <div className='text-white text-center'>{error}</div>
        ) : (
          <div className='text-white  rounded-md min-w-[780px]'>
            {logs && logs.device_logs.length > 0 ? (
              logs.device_logs.map((log, index) => {

                const formattedLog = {
                  ...log,
                  s_no : index + 1,
                  time : new Date(log.created_at).toLocaleTimeString('en-IN', { hour12: false }),
                  date : new Date(log.created_at).toLocaleDateString('en-IN', { hour12: false })
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
