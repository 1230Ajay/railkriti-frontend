'use client'

import { useState, useEffect } from "react";
import 'chartjs-adapter-date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { RiFileExcel2Fill, RiRestartLine } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import NavBar from "@/components/nav/navbar";

import { Titles } from "@/lib/data/title";
import socketTRWLMS from "@/lib/services/SocketTRWLMSService";
import HeaderTable from "@/components/headers/header.table";
import { TRTableHeaderData } from "@/lib/data/tr-wlms/data.dashboard-header";
import { HeaderTile } from "@/components/headers/header.tile";
import TableRow from "@/components/tiles/tile.table-row";


interface Section {
    uid: string;
    name: string;
    division_uid: string;
    sectional_code: string;
    division: any; // Change `any` to a more specific type if the division structure is known
}

interface DeviceData {
    s_no: any;
    uid: string;
    battery: number;
    bottom_sensor_state: boolean;
    created_at: string; // ISO date string
    end_date: string; // ISO date string
    imei: string;
    isActive: boolean;
    is_on_track: boolean;
    is_online: boolean;
    km: string;
    lattitude: string;
    location: string;
    longitude: string;
    mobile_no: string;
    relay_status: boolean;
    section: Section;
    section_uid: string;
    start_date: string; // ISO date string
    top_sensor_state: boolean;
    updated_at: string; // ISO date string
}



const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [devices, setDevices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');  // Step 1: Add state for search query


    const handleRestartClick = (deviceUid: string) => {
        socketTRWLMS.emit('rebootDevice', { "uid": deviceUid });
    };

    useEffect(() => {
        const handleDevicesUpdate = (updatedDevices: any[]) => {
            console.log(updatedDevices)
            setDevices(updatedDevices);
        };

        const handleDisconnect = () => {
            console.log('Disconnected from server');
        };



        socketTRWLMS.on('devices', handleDevicesUpdate);
        socketTRWLMS.on('disconnect', handleDisconnect);


        return () => {
            socketTRWLMS.off('connect');
            socketTRWLMS.off('deviceUpdateToUser');
            socketTRWLMS.off('disconnect');
        };

    });



    const totalDevices = devices.length;
    const onlineDevices = devices.filter(device => device.is_online).length;
    const offlineDevices = totalDevices - onlineDevices;
    const activeDevices = devices.filter(device => device.isActive).length;


    const filteredDevices = devices.filter(device =>
        (device.location.toLowerCase().includes(searchQuery.toLowerCase()) || device.km.toLowerCase().includes(searchQuery.toLowerCase())) && device?.isActive
    );



    const columns = [
        { name: 'S. No.', key: "s_no", className: "text-start" },
        { name: "Bridge No", key: "location", className: "text-start" },
        { name: "River", key: "km", className: "text-start" },
        { name: "Battery", key: "battery" },
        { name: "Device Status", key: "is_online" },
    ];


    return (
        <div className="h-[calc(100vh-80px)] xl:grid grid-rows-[auto_auto_1fr] ">
            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <HeaderTile title={"DEVICE LIVE STATUS"} onSearchChange={setSearchQuery} actions={[
                {
                    icon: <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />,
                    onClick: () => { }
                },
                {
                    icon: <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />,
                    onClick: () => { }
                },
                {
                    icon: <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />,
                    onClick: () => { }
                }
            ]} />


            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">
                <HeaderTable columns={TRTableHeaderData} />

                {filteredDevices.map((device, index) => {
                    const formattedDevice = {
                        s_no :index + 1,
                        ...device,
                        battery:`${device.battery}%`
                    }
                    return (

                        <TableRow data={formattedDevice} columns={columns} actions={[

                            {
                                icon: <GrMapLocation />,
                                onClick: () => { }
                            },
                            {
                                icon: <div>
                                    {device.bottom_sensor_state ? "Alert" : "OK"}
                                </div>,
                                onClick: () => { },
                                className: ` ${device.bottom_sensor_state ? 'bg-red-500' : 'bg-green-500'} w-20 rounded-full font-bold py-[3px]`
                            }, {
                                icon: <div>
                                    {device.top_sensor_state ? "Alert" : "OK"}
                                </div>,
                                onClick: () => { },
                                className: ` ${device.top_sensor_state ? 'bg-red-500' : 'bg-green-500'} w-20 rounded-full font-bold py-[3px]`
                            },
                            {
                                icon: <RiRestartLine />,
                                onClick: () => {
                                    handleRestartClick(device.uid);
                                    toast.info(`${device.location} (${device.km}) is being Restart`);
                                },
                                className: ` p-2 rounded-full ${device.relay_status ? 'bg-green-500' : 'bg-gray-500'}`,
                            },
                            {
                                icon: <TbListDetails />,
                                onClick: () => {
                                    const path = `/tr-wlms/logs/${device?.uid}`;
                                    const url = `${window.location.origin}${path}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                },
                                className: ` bg-white px-6 py-1 text-green-500  rounded-full `,
                            },
                        ]} />

                    )
                })}

            </div>


        </div>
    );
};

export default Dashboard;
