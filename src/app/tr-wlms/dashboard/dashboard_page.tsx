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
import { useDispatch, useSelector } from "react-redux";
import { enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import NavBar from "@/components/nav/navbar";

import { Titles } from "@/lib/data/title";
import socketTRWLMS from "@/lib/services/SocketTRWLMSService";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [devices, setDevices] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');  // Step 1: Add state for search query

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

    const handleRestartClick = (deviceUid: string) => {
            socketTRWLMS.emit('rebootDevice', { "uid": deviceUid });
    };

    useEffect(() => {
        const handleDevicesUpdate = (updatedDevices: any[]) => {
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
        device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||   device.km.toLowerCase().includes(searchQuery.toLowerCase())
      );
    

    return (
        <div className="h-screen xl:grid grid-rows-[auto_auto_auto_1fr] ">
            <NavBar title={Titles.TrWlmsTitle}  ></NavBar>

            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <div className="flex justify-between max-h-16 items-center mx-4 py-4  bg-black rounded-t-md mt-4 px-4 ">
                <h2 className="font-bold text-white text-xl uppercase">Device Live Status</h2>
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
                    <p className="text-start">  location</p>
                    <p className=" text-start">kM</p>


                    <p className={`  text-center `}>
                        Bottom sensor
                    </p>
                    
                    <p className={`  text-center `}>
                        Top sensor
                    </p>

                    <p className="lg:ml-8">GPS</p>
                    <p className="lg:ml-4">Battery</p>

                    <p className=" text-center">status</p>



                    <p className=" text-center">restart</p>
                    <p className={` text-end mr-4 `}>
                        Details
                    </p>

                </div>

                {filteredDevices.map((device, index) => (
                    <div key={index} className=" ">
                        <div className={`text-center min-w-[720px] text-xs md:text-base grid grid-cols-10 ${activeDetail === device.uid ? '' : 'border-b'} border-gray-600 items-center py-2`}>
                            <p className=" ml-4 text-start">{index + 1}</p>
                            <p className=" text-start capitalize">{device.location}</p>
                            <p className=" text-start uppercase">{device.km}</p>
                            <div className="flex justify-center">
                                <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${device.bottom_sensor_state && device.is_online   ? 'bg-primary text-white  ' : 'bg-green-600 text-white'}`}>
                                    {device.bottom_sensor_state && device.is_online  ? "Low Alert" : "OK"}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${device.top_sensor_state && device.is_online  ? 'bg-primary text-white  ' : 'bg-green-600 text-white'}`}>
                                    {device.top_sensor_state && device.is_online  ?   "High Alert" : "OK"}
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
                                            if(device.relay_status){
                                                handleRestartClick(device.uid)
                                            toast.success(`${device.location} (${device.km}) is being restarted`);
                                            }else{
                                                toast.error(`Relay is Offline`);
                                            }
                                        }
                                    }}
                    
                                >
                                    <RiRestartLine />
                                </button>
                            </div>
                            <div className='flex mr-4 h-full items-center justify-end'>
                                <button
                                    onClick={()=>{
                                    const path =`/tr-wlms/logs/${device.uid}`
                                    const url = `${window.location.origin}${path}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                                    className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                                >
                                    <TbListDetails />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

            </div>


        </div>
    );
};

export default Dashboard;
