'use client'

import { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from "react-icons/bs";
import { TbListDetails } from "react-icons/tb";
import { RiFileExcel2Fill, RiRestartLine } from "react-icons/ri";
import { GrMapLocation } from "react-icons/gr";
import socket from "@/lib/services/SocketService";
import { useDispatch, useSelector } from "react-redux";
import { disableButton, enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import { PrimaryButton } from "@/components/buttons/primarybutton";
import NavBar from "@/components/nav/navbar";
import conf from "@/lib/conf/conf";
import myIntercepter from "@/lib/interceptor";
import { Titles } from "@/lib/data/title";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [devices, setDevices] = useState<any[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
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
            socket.emit('rebootDevice', { "uid": deviceUid });

    };

    useEffect(() => {

        const handleDevicesUpdate = (updatedDevices: any[]) => {
            console.log(updatedDevices);
            setDevices(updatedDevices);
        };

        const handleDisconnect = () => {
            console.log('Disconnected from server');
        };


        socket.on('devices', handleDevicesUpdate);
        socket.on('disconnect', handleDisconnect);



        return () => {
            socket.off('connect');
            socket.off('devices');
            socket.off('disconnect');
        };
    });

    useEffect(() => {
        if (activeDetail) {
            fetchChartData(activeDetail);
        }
    }, [selectedDate, activeDetail]);


    const getDateRange = (selectedDate:any) => {
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
      
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
      
        return { start: startDate, end: endDate };
      };

    const fetchChartData = async (uid: string) => {
        try {

            const date = getDateRange(selectedDate);

            const response = await myIntercepter.get(`${conf.BR_WLMS}/api/logs/${uid}`,{
                params:{start:date.start, end:date.end }
            });
            const data = response.data;
            const processedData = processChartData(data.device_logs);
            setChartData(processedData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const processChartData = (data: any[]) => {
        const hourlyData = Array(24).fill(null);
        data.forEach((entry) => {
            const hour = new Date(entry.created_at).getHours();
            hourlyData[hour] = - entry.level; // Assuming 'level' is the value you want to plot
        });
        return hourlyData;
    };


    const toggleDetail = (uid: string) => {
        setActiveDetail((prevUid) => (prevUid === uid ? null : uid));
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const lineChartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hours 0-23
        datasets: [
            {
                label: ' From DL',
                data: chartData, // Use fetched chart data
                borderColor: 'rgba(0, 119, 204, 1)', // Main line color
                backgroundColor: 'rgba(0, 119, 204, 0.35)', // Area fill color (transparent or semi-transparent)
                borderWidth: 3,
                pointBackgroundColor: 'rgba(0, 119, 204, 1)', // Point color
                pointBorderColor: 'rgba(0, 119, 204, 1)', // Point border color

            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0.1)',
                },
                ticks: {
                    color: '#ffffff',
                },
            },
            y: {
                min: -25,
                max: 0,
                grid: {
                    color: 'rgba(255,255,255,0.1)',
                },
                ticks: {
                    color: '#ffffff',
                    callback: function (value: any) {
                        return `${Math.abs(value)}`; // Convert negative values to positive for display
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function (context: any) {
                        // Assuming your labels are in the context object
                        let label = context[0].label;
                        return `Time : ${label}`;
                    },
                    label: function (context: any) {
                        // Assuming your data points are in context.raw
                        let value = context.raw;
                        return `  From DL : ${Math.abs(value.toFixed(2))}`; // Convert negative values to positive for display in tooltips
                    },
                },
            },
        },
        elements: {
            line: {
                tension: 0.3,
            },
        },
        spanGaps: true,
        animation: {
            duration: 2000, // Adjust animation duration in milliseconds
        },
    };

    const totalDevices = devices.length;
    const onlineDevices = devices.filter(device => device.is_online).length;
    const offlineDevices = totalDevices - onlineDevices;
    const activeDevices = devices.filter(device => device.isActive).length;

    const filteredDevices = devices.filter(device =>
        device.bridge_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.river_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen xl:grid  grid-rows-[auto_auto_auto_1fr] ">
            <NavBar title={Titles.BrWlmsTitle} ></NavBar>

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
                    <p className=" text-start">bridge no</p>
                    <p className="text-start">  river name</p>
                    <p className="lg:ml-8">GPS</p>
                    <p className="lg:ml-4">level</p>
                    <p className="lg:ml-4">Battery</p>

                    <p className=" text-center">status</p>

                    <p className={`  text-center `}>
                        sensor
                    </p>

                    <p className=" text-center">restart</p>
                    <p className={` text-end mr-4 `}>
                        Details
                    </p>

                </div>

                {filteredDevices.map((device, index) => (
                    <div key={device.uid} className=" ">
                        <div className={`text-center min-w-[720px] text-xs md:text-base grid grid-cols-10 ${activeDetail === device.uid ? '' : 'border-b'} border-gray-600 items-center py-2`}>
                            <p className=" ml-4 text-start">{index + 1}</p>
                            <p className=" text-start uppercase">{device.bridge_no}</p>
                            <p className=" text-start capitalize">{device.river_name}</p>
                            <p className="lg:ml-8  cursor-pointer flex justify-center">
                                <GrMapLocation onClick={
                                    () => {
                                        const encodedUrl = encodeURIComponent(`${device.river_name}-${device.bridge_no}`)
                                        const path = `/location/${device.lattitude}-${device.longitude}-${encodedUrl}`
                                        const url = `${window.location.origin}${path}`;
                                        
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }
                                } className="w-fit" />
                            </p>
                            <p className="lg:ml-4 ">{device.current_level ? device.current_level < 0 ? "Error" : `${device.current_level.toFixed(2)} m` : 0}</p>
                            <p className="lg:ml-4">{device.battery && device.is_online ? device.battery : 0}%</p>
                            <div className="flex justify-center">
                                <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${device.is_online ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {device.is_online ? 'Online' : 'Offline'}
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <p className={`uppercase w-fit px-4 rounded-full py-1 font-semibold ${device.sensor_status && device.is_online ? 'bg-green-600 text-white ' : 'bg-red-600 text-white'}`}>
                                    {device.sensor_status && device.is_online ? "ON" : "OFF"}
                                </p>
                            </div>
                            <div className="flex justify-center items-center ">
                                <button
                                    className={`flex  w-fit items-center justify-center ${ !device.relay_status ? 'bg-gray-600' : 'bg-green-600'} rounded-full p-2`}
                                    onClick={() => {
                                        if (device.is_online) {
                                            toast.error(`Device is allready online`);
                                        } else {
                                          if(device.relay_status){
                                            handleRestartClick(device.uid)
                                            toast.success(`${device.river_name} (${device.bridge_no}) is being restarted`);
                                          }
                                        }
                                    }}
                               
                                >
                                    <RiRestartLine />
                                </button>
                            </div>
                            <div className='flex mr-4 h-full items-center justify-end'>
                                <button
                                    onClick={() => toggleDetail(device.uid)}
                                    className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                                >
                                    <TbListDetails />
                                </button>
                            </div>
                        </div>
                        {activeDetail === device.uid && (
                            <div className=" relative border border-primary min-w-[720px]   px-4 pt-1 pb-3 rounded-md ">
                                <div className=" capitalize absolute bottom-10 right-4 text-2xl text-primary font-bold ">{device.river_name} ({device.bridge_no})</div>
                                <div className="flex relative justify-between bg-black   rounded-md items-center  ">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        className=" px-2 py-1   rounded-sm text-black font-semibold text-center"
                                    />
                                    <div className=" flex items-center justify-center space-x-4">
                                        <div className=" hidden lg:flex h-14  capitalize    gap-x-8 text-sm  font-semibold  items-center ">
                                            {/* <div className=" flex items-center space-x-2 uppercase" >
                                                <p>zone  :</p> <p className=" text-primary ml-2">{device.zone}</p>
                                            </div>
                                            <div className=" flex items-center space-x-2 " >
                                                division : <p className=" text-primary ml-2">{device.division}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 " >
                                                section : <p className=" text-primary ml-2">{device.section}</p>
                                            </div>
                                            <div className=" flex items-center space-x-2 " >
                                                Danger level (MSL) : <p className=" text-primary ml-2">{device.danger_level.toFixed(2)}m</p>
                                            </div>
                                            <div className="flex items-center space-x-2 " >
                                                Rail Level (MSL) : <p className=" text-primary ml-2">{device.rail_level.toFixed(2)}m</p>
                                            </div> */}

                                        </div>

                                        <PrimaryButton onClick={() => {
                                            const path = `/wlms/logs/${device.uid}`
                                            const url = `${window.location.origin}${path}`;
                                            window.open(url, '_blank', 'noopener,noreferrer');
                                        }} >Logs</PrimaryButton>

                                    </div>
                                </div>

                                <div className="min-w-[720px] h-[32vh] pr-4">
                                    <Line data={lineChartData} options={lineChartOptions} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            </div>


        </div>
    );
};

export default Dashboard;
