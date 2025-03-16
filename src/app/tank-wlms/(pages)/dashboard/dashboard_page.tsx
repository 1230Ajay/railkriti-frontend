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
import socket from "@/lib/services/tankWLMS";
import { useDispatch, useSelector } from "react-redux";
import { enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import { PrimaryButton } from "@/components/buttons/primarybutton";
import NavBar from "@/components/nav/navbar";

import myIntercepter from "@/lib/interceptor";
import { getStoredJwt } from "../../../../../getCoockies";
import { Titles } from "@/lib/data/title";
import conf from "@/lib/conf/conf";
import HeaderTable from "@/components/headers/header.table";
import { TankWLMSDashboardTableHeaderData } from "@/lib/data/tn-wlms/data.dashboard-header";
import { HeaderTile } from "@/components/headers/header.tile";
import TableRow from "@/components/tiles/tile.table-row";
import TableRowV2 from "@/components/tiles/tile.table-row-v2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);
    const [activeDetail, setActiveDetail] = useState<any | null>(null);
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
        socket.emit('rebootDevice', { "uid": deviceUid })
    };

    useEffect(() => {



        const handleDevicesUpdate = (updatedDevices: any[]) => {
            setDevices(updatedDevices);
        };

        const handleDisconnect = () => {
            console.log('Disconnected from server');
        };





        socket.on('devices', handleDevicesUpdate);
        socket.on('disconnect', handleDisconnect);


        return () => {
            socket.off('connect');
            socket.off('deviceUpdateToUser');
            socket.off('disconnect');
        };
    });

    useEffect(() => {
        if (activeDetail) {
            fetchChartData(activeDetail.uid);
        }
    }, [selectedDate, activeDetail]);


    const getDateRange = (selectedDate: any) => {
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        return { start: startDate, end: endDate };
    };


    const fetchChartData = async (uid: string) => {


        try {
            const dates = getDateRange(selectedDate)
            const response = await myIntercepter.get(`${conf.TANK_WLMS}/api/logs/${uid}`, {
                params: dates
            });
            const data = response.data.device_logs;
            const processedData = processChartData(data);
            setChartData(processedData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    const processChartData = (data: any[]) => {
        const hourlyData = Array(24).fill(null);
        data.forEach((entry) => {
            const hour = new Date(entry.created_at).getHours();
            hourlyData[hour] = entry.tank_level; // Assuming 'level' is the value you want to plot
        });
        return hourlyData;
    };

    const toggleSidebar = () => {
        setSearchState(!searchState);
    };



    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const lineChartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hours 0-23
        datasets: [
            {
                label: ' Tank Level',
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
                min: 0,
                max: 120,
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
                        return `  Tank Level : ${Math.abs(value.toFixed(2))}`; // Convert negative values to positive for display in tooltips
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
        (device.location.toLowerCase().includes(searchQuery.toLowerCase()) || device.km.toLowerCase().includes(searchQuery.toLowerCase())) && device?.isActive
    );


    const columns = [
        {
            name: "", key: "s_no", className: " text-start"
        },
        {
            name: "", key: "km", className: " text-start"
        },
        {
            name: "", key: "location", className: " text-start"
        },
        {
            name: "", key: "tank_level", className: " text-start"
        },
        {
            name: "", key: "battery", className: " text-start"
        },
        {
            name: "", key: "is_online", className: " text-start"
        },
        {
            name: "", key: "sensor_status", className: " text-start"
        }
    ]


    return (
        <div className="h-[calc(100vh-80px)] grid xl:grid grid-rows-[auto_auto_1fr] ">


            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <HeaderTile title="BR Devices" onSearchChange={setSearchQuery} actions={[
                { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
                { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
                { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
            ]} />

            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">

                <HeaderTable columns={TankWLMSDashboardTableHeaderData} />

                {filteredDevices.map((device, index) => {
                    device.s_no = index + 1;
                    return (
                        <TableRowV2 data={device} columns={columns} actions={[
                            {
                                icon: <GrMapLocation />,
                                onClick: () => {
                                    const encodedUrl = encodeURIComponent(`${device.river_name}-${device.bridge_no}`);
                                    const path = `/location/${device.lattitude}-${device.longitude}-${encodedUrl}`;
                                    const url = `${window.location.origin}${path}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                },
                            },
                            {
                                icon: <RiRestartLine />,
                                onClick: () => {
                                    if (device.is_online) {
                                        toast.error(`Device is allready online`);
                                    } else {
                                        handleRestartClick(device.uid);
                                        toast.success(`${device.location} (${device.km}) is being restarted`);
                                    }
                                },
                                className: ` p-2 rounded-full ${device.relay_status ? 'bg-green-500' : 'bg-gray-500'}`,
                            },
                            {
                                icon: <TbListDetails />,
                                onClick: () => {
                                    if (activeDetail?.uid !== device.uid) {
                                        setActiveDetail(device);
                                    } else {
                                        setActiveDetail(null);
                                    }
                                },
                                className: `bg-white px-6 py-1 text-green-500  rounded-full `,
                            },
                        ]} active_uid={activeDetail?.uid || ""} activeContainer={TNDashboardChart(device)} />
                    )
                })}

            </div>


        </div>
    );

    function TNDashboardChart(device: any) {
        return <div className=" relative border border-primary min-w-[720px] px-4 pt-1 pb-3 rounded-md ">
            <div className=" capitalize absolute bottom-10 right-4 text-2xl text-primary font-bold ">{device.km} ({device.location})</div>
            <div className="flex relative justify-between bg-black  rounded-md items-center  ">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className=" px-2 py-1   rounded-sm text-black font-semibold text-center" />
                <div className=" flex items-center justify-center space-x-4">
                    <div className=" hidden lg:flex h-14  uppercase    gap-x-8 text-sm  font-semibold  items-center ">
                        <div className=" flex items-center space-x-2 x">
                            <p>zone  :</p> <p className=" text-primary ml-2">{device.section.division.zone.zonal_code}</p>
                        </div>
                        <div className=" flex items-center space-x-2 ">
                            division : <p className=" text-primary ml-2">{device.section.division.divisional_code}</p>
                        </div>
                        <div className="flex items-center space-x-2 ">
                            section : <p className=" text-primary ml-2">{device.section.name}</p>
                        </div>
                        <div className=" flex items-center space-x-2 ">
                            Tank Level : <p className=" text-primary ml-2">{device.tank_level}</p>
                        </div>


                    </div>

                    <PrimaryButton onClick={() => {
                        const path = `/tank-wlms/logs/${device.uid}`;
                        const url = `${window.location.origin}${path}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }}>Logs</PrimaryButton>

                </div>
            </div>

            <div className="min-w-[720px] h-[32vh] flex justify-center items-center pr-4 ">
                <Line data={lineChartData} options={lineChartOptions} />
                {/*<div className=" text-4xl capitalize text-primary">under maintainance</div>  */}
            </div>
        </div>;
    }
};

export default Dashboard;
