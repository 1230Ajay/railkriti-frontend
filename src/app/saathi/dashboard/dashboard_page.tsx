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
import NavBar from "@/components/nav/navbar";


import { Titles } from "@/lib/data/title";
import socketSaathiTX from "@/lib/services/socketSaathiTx";
import socketSaathiRx from "@/lib/services/socketSaathiRx";

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

    const handleRestartClickTx = (deviceUid: string) => {
        true ? socketSaathiTX.emit('rebootDevice', { "uid": deviceUid }) : socketSaathiRx.emit('rebootDevice', { "uid": deviceUid });;
    };

    useEffect(() => {

        const handleDevicesUpdate = (updatedDevices: any[]) => {
            setDevicesTx(updatedDevices);
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
            setDevicesRx(updatedDevices);
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
        return device?.sensor_status !==undefined; // Returns true if sensor_status is not null/undefined
    };

    const filteredDevices = [...devicesRx, ...devicesTx].filter(device =>
        device?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && device?.isActive
    );

    const totalDevice = [...devicesRx, ...devicesTx].length;
    const onlineDevices = filteredDevices.filter(device => device.is_online).length;
    const offlineDevices = totalDevice - onlineDevices;
    const activeDevices = filteredDevices.filter(device => device.isActive).length;


    return (
        <div className="h-screen xl:grid grid-rows-[auto_auto_auto_1fr] ">
            <NavBar title={Titles.SaathiTitle}></NavBar>

            <DevicesStatics totalDevices={totalDevice} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <div className="flex justify-between max-h-16 items-center mx-4 py-4  bg-black rounded-t-md mt-4 px-4 ">
                <div className="  transition-all space-x-2  font-bold  border-primary px-2 rounded-sm  text-md uppercase text-white">Devices</div>
                <div className=' flex-col md:flex-row md:space-x-4 hidden md:flex'>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-white px-4 py-1 rounded-sm text-primary w-full'
                    />

                    <div className='flex space-x-4 pt-2 md:pt-0 text-white  '>
                        <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
                        <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
                        <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
                    </div>
                </div>
            </div>


            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">

                <div className="grid grid-cols-10  text-white font-bold   min-w-[720px] bg-black   text-center border-y-2   text-xs md:text-base capitalize items-center pb-2 py-2">
                    <p className=" text-start">Sr. No.</p>
                    <p className="text-start">  Name</p>
                    <p>Type</p>
                    <p className="text-start">  Installed at</p>
                    <p className={`  text-center `}>Sensor/Hooter</p>
                    <p className="lg:ml-8">GPS</p>
                    <p className="lg:ml-4">Battery</p>
                    <p className=" text-center">status</p>
                    <p className=" text-center">restart</p>
                    <p className={` text-end mr-4 `}>Details</p>
                </div>

                {filteredDevices.sort((a, b) => (a?.group_uid && b?.group_uid) ? a.group_uid.localeCompare(b.group_uid) : 0).map((device, index) => {


                    return (

                        <div key={index} className=" ">
                            <div className={`text-center min-w-[720px] text-xs md:text-base grid grid-cols-10 ${activeDetail === device.uid ? '' : 'border-b'} border-gray-600 items-center py-2`}>
                                <p className=" ml-4 text-start">{index + 1}</p>
                                <p className=" text-start capitalize">{device.name}</p>
                                <p className="text-yellow-100">
                                    { isTxDevice(device) ? "Tx" : "Rx"}
                                </p>
                                <p className=" text-start capitalize">{device.is_fixed ? "Fixed" : "Mobile"} / {device.installed_at}</p>
                                <div className="flex justify-center">
                                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${(isTxDevice(device) ? device.sensor_status : device.hooter_status) && device.is_online ? 'bg-green-600 text-white' : 'bg-primary text-white  '}`}>
                                    {(isTxDevice(device) ? device.sensor_status : device.hooter_status) && device.is_online ? "OK" : "Error"}
                                    </p>
                                </div>

                                <p className="lg:ml-8  cursor-pointer flex justify-center">
                                    <GrMapLocation onClick={
                                        () => {
                                            const encodedUrl = encodeURIComponent(`${device.location}-${device.km}`)
                                            const path = `/location/${device.lattitude}-${device.longitude}-${encodedUrl}`
                                            const url = `${window.location.origin}${path}`;
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }
                                    } className="w-fit" />
                                </p>

                                <p className="lg:ml-4">{device.battery && device.is_online ? device.battery : 0}%</p>

                                <div className="flex justify-center">
                                    <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${device.is_online ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {device.is_online ? 'Online' : 'Offline'}
                                    </p>
                                </div>

                                <div className="flex justify-center items-center ">
                                    <button
                                        className={`flex  w-fit items-center justify-center ${!device.relay_status ? 'bg-gray-600' : 'bg-green-600'} rounded-full p-2`}
                                        onClick={() => {
                                            if (device.is_online) {
                                                toast.error(`Device is allready online`);
                                            } else {
                                                if (device.relay_status) {
                                                    handleRestartClickTx(device.uid)
                                                    toast.success(`${device.name}  is being restarted`);
                                                } else {
                                                    toast.error(`Relay is offline`);
                                                }
                                            }
                                        }}

                                    >
                                        <RiRestartLine />
                                    </button>
                                </div>
                                <div className='flex mr-4 h-full items-center justify-end'>
                                    <button
                                        onClick={() => {
                                            const path_tx = `/saathi/logs_tx/${device.uid}`;
                                            const path_rx = `/saathi/logs_rx/${device.uid}`
                                            const url = `${window.location.origin}${ isTxDevice(device)? path_tx:path_rx}`;
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }}
                                        className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                                    >
                                        <TbListDetails />
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
                })}

            </div>


        </div>
    );
};

export default Dashboard;
