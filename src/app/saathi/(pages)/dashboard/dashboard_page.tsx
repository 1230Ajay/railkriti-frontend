'use client'

import { useState, useEffect } from "react";

import 'react-datepicker/dist/react-datepicker.css';

import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { RiFileExcel2Fill, RiRestartLine } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import socketSaathiTX from "@/lib/services/socketSaathiTx";
import socketSaathiRx from "@/lib/services/socketSaathiRx";
import { HeaderTile } from "@/components/headers/header.tile";
import HeaderTable from "@/components/headers/header.table";
import { SaathiDashboardTableHeaderData } from "@/lib/data/saathi/data.dashboard-header";
import TableRow from "@/components/tiles/tile.table-row";

const Dashboard: React.FC = (): JSX.Element => {

    const [activeDetail, setActiveDetail] = useState<string | null>(null);

    const [devicesTx, setDevicesTx] = useState<any[]>([]);
    const [devicesRx, setDevicesRx] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();
    const deviceButtonStates = useSelector((state: any) => state.button.deviceButtonStates);


    useEffect(() => {
        Object.keys(deviceButtonStates).forEach((deviceUid) => {
            const { timer } = deviceButtonStates[deviceUid];
            if (timer) {
                const remainingTime = timer - Date.now();
                if (remainingTime > 0) {
                    const timeoutId = setTimeout(() => {
                        dispatch(enableButton({ deviceUid }));
                        dispatch(setTimer({ deviceUid, timer: null }));
                    }, remainingTime);
                    return () => clearTimeout(timeoutId);
                }
            }
        });
    }, [deviceButtonStates, dispatch]);

    const handleRestartClick = (deviceUid: string,isTx:any) => {
        isTx ? socketSaathiTX.emit('rebootDevice', { "uid": deviceUid }) : socketSaathiRx.emit('rebootDevice', { "uid": deviceUid });;
    };

    useEffect(() => {

        const handleDevicesUpdate = (updatedDevices: any[]) => {
            setDevicesTx(updatedDevices.map((device) => ({
                ...device,  // Spread to keep other properties intact
                type: "TX"  // Assign "RX" to type
            })));
        };
        

        const handleDisconnect = () => {
            console.log('Disconnected from server');
        };

        socketSaathiTX.on('devices', handleDevicesUpdate);
        socketSaathiTX.on('disconnect', handleDisconnect);

        return () => {

            socketSaathiTX.off('deviceUpdateToUser');
            socketSaathiTX.off('disconnect');
        };

    });



    useEffect(() => {

        const handleDevicesUpdate = (updatedDevices: any[]) => {
            setDevicesRx(updatedDevices.map((device)=>({
                ...device,
                type:"RX"
            })));
        };

        const handleDisconnect = () => {
            console.log('Disconnected from server');
        };


        socketSaathiRx.on('devices', handleDevicesUpdate);
        socketSaathiRx.on('disconnect', handleDisconnect);

        return () => {
            socketSaathiRx.off('connect');
            socketSaathiRx.off('deviceUpdateToUser');
            socketSaathiRx.off('disconnect');
        };

    });


    
    const isTxDevice = (device: any): boolean => {
   
        return  device.type==="TX"; 
    };
    

    const filteredDevices = [...devicesRx, ...devicesTx].filter(device =>
        device?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && device?.isActive
    );

    const totalDevice = [...devicesRx, ...devicesTx].length;
    const onlineDevices = filteredDevices.filter(device => device.is_online).length;
    const offlineDevices = totalDevice - onlineDevices;
    const activeDevices = filteredDevices.filter(device => device.isActive).length;

    const columns = [
        {
            name: "", key: "s_no", className: " text-start"
        },
        {
            name: "", key: "name", className: " text-start uppercase"
        },
        {
            name: "", key: "type", className: ""
        },
        {
            name: "", key: "battery", className: ""
        },
        {
            name: "", key: "sensor_status", className: ""
        },

        {
            name: "", key: "is_online", className: ""
        },

    ]


    return (
        <div className="h-[calc(100vh-80px)] xl:grid grid-rows-[auto_auto_auto_1fr] ">

            <DevicesStatics totalDevices={totalDevice} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />
            <HeaderTile title="Devices" onSearchChange={setSearchQuery} actions={[
                { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
                { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
                { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
            ]} />


            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">

                <HeaderTable columns={SaathiDashboardTableHeaderData} />

                {filteredDevices.sort((a, b) => (a?.group_uid && b?.group_uid) ? a.group_uid.localeCompare(b.group_uid) : 0).map((device, index) => {
                    
                    device.s_no = index+1;
                    device.sensor_status = device.is_online & device.sensor_status ;
                    return (
                     <TableRow data={device} columns={columns} actions={[
                        {
                            icon: <GrMapLocation />,
                            onClick: () => {
                                const encodedUrl = encodeURIComponent(`${device.name}`);
                                const path = `/location/${device.lattitude}-${device.longitude}-${encodedUrl}`;
                                const url = `${window.location.origin}${path}`;
                                window.open(url, '_blank', 'noopener,noreferrer');
                            },
                        },
                        {
                            icon: <RiRestartLine />,
                            onClick: () => {
                                    handleRestartClick(device.uid,isTxDevice(device));
                                    toast.success(`${device.location} (${device.km}) is being restarted`);
                          
                            },
                            className: ` p-2 rounded-full ${device.relay_status ? 'bg-green-500' : 'bg-gray-500'}`,
                        },
                        {
                            icon: <TbListDetails />,
                            onClick: () => {
                                const path_tx = `/saathi/logs_tx/${device.uid}`;
                                const path_rx = `/saathi/logs_rx/${device.uid}`;
                                const url = `${window.location.origin}${isTxDevice(device) ? path_tx : path_rx}`;
                                window.open(url, '_blank', 'noopener,noreferrer');
                            },
                            className: `bg-white px-6 py-1 text-green-500  rounded-full `,
                        },
                     ]} />
                    )

                })}

            </div>


        </div>
    );
};

export default Dashboard;
