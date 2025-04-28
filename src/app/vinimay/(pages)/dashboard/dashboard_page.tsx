'use client'

import { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

import 'react-datepicker/dist/react-datepicker.css';

import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { RiFileExcel2Fill, RiRestartLine } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import DevicesStatics from "@/components/DevicesStatics";
import NavBar from "@/components/nav/navbar";
import { Titles } from "@/lib/data/title";
import conf from "@/lib/conf/conf";
import myInterceptor from "@/lib/interceptor";
import { HeaderTile } from "@/components/headers/header.tile";
import HeaderTable from "@/components/headers/header.table";
import { VinimayDashboardTableHeaderData } from "@/lib/data/vinimay/data.dashboard-header";
import TableRow from "@/components/tiles/tile.table-row";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [devices, setDevices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');  // Step 1: Add state for search query




    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await myInterceptor.get(`${conf.VINIMAY_URL}/device`);
                if(res.status===200){
                    setDevices(res.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []); 



    const totalDevices = devices.length;
    const onlineDevices = devices.filter(device => device.is_online).length;
    const offlineDevices = totalDevices - onlineDevices;
    const activeDevices = devices.filter(device => device.isActive).length;


    const filteredDevices = devices.filter(device =>
       ( device.lc.toLowerCase().includes(searchQuery.toLowerCase()) ||   device.km.toLowerCase().includes(searchQuery.toLowerCase()))&& device?.isActive
      );
    
      const columns = [
        { name: "", key: "s_no", className: "text-start uppercase" },
        { name: "", key: "lc", className: "text-start uppercase" },
        { name: "", key: "btw_stn", className: "text-start uppercase" },
        { name: "", key: "type", className: "text-start uppercase" },
        { name: "", key: "km", className: "text-start uppercase" },
        { name: "", key: "gate_status_t" },
        { name: "", key: "is_online" },
    ];

    return (
        <div className="h-[calc(100vh-80px)] xl:grid grid-rows-[auto_auto_1fr] ">
            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />
            <HeaderTile title="Devices" onSearchChange={setSearchQuery} actions={[
                { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
                { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
                { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
            ]} />

            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">
                <HeaderTable columns={VinimayDashboardTableHeaderData}/>
                {filteredDevices.map((device, index) => {
                     device.s_no=index+1;
                     device.type = device.is_ctrt ?"CTRT":"OTRT";
                     device.gate_status_t = device.gate_status  ?"OPEN":"CLOSE";
                    return (
                   <TableRow data={device} columns={columns} actions={[
                    {
                        icon: <GrMapLocation />,
                        onClick: () => { }
                    },
                    {
                        icon: <TbListDetails />,
                        onClick: () => {
                            const path = `/vinimay/logs/${device?.uid}`;
                            const url = `${window.location.origin}${path}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                        },
                        className: ` bg-white px-6 py-1 text-green-500  rounded-full `,
                    },
                   ]}/>
                )})}
            </div>
        </div>
    );
};

export default Dashboard;
