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
import { enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import { PrimaryButton } from "@/components/buttons/primarybutton";
import NavBar from "@/components/nav/navbar";
import conf from "@/lib/conf/conf";
import myIntercepter from "@/lib/interceptor";
import { Titles } from "@/lib/data/title";
import { HeaderTile } from "@/components/headers/header.tile";
import HeaderTable from "@/components/headers/header.table";
import { BrDashboardTableHeaderData } from "@/lib/data/header/br-wlms/data.dashboard-header";
import TableRow from "@/components/tiles/tile.table-row";
import TableRowV2 from "@/components/tiles/tile.table-row-v2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


interface Section {
    uid: string;
    name: string;
    division_uid: string;
    sectional_code: string;
    division: Record<string, any>; // Adjust based on actual division structure
}

interface Device {
    s_no: any;
    uid: string;
    bridge_no: string;
    created_at: string;
    current_level: number;
    danger_level: number;
    end_date: string;
    imei: string;
    isActive: boolean;
    is_online: boolean;
    lattitude: string;
    longitude: string;
    mobile_no: string;
    rail_level: number;
    reading_interval: number;
    relay_status: boolean;
    river_name: string;
    section: Section;
    section_uid: string;
    sensor_level: number;
    sensor_status: boolean;
    start_date: string;
    update_log_time: string;
    updated_at: string;
    wl_msl: number;
    battery: string;
}


const Dashboard: React.FC = (): JSX.Element => {
    const [searchState, setSearchState] = useState(false);
    const [activeDetail, setActiveDetail] = useState<Device | null>(null);
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

            const date = getDateRange(selectedDate);

            const response = await myIntercepter.get(`${conf.BR_WLMS}/api/logs/${uid}`, {
                params: { start: date.start, end: date.end }
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
        (device.bridge_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.river_name.toLowerCase().includes(searchQuery.toLowerCase())) && device?.isActive
    );


    const columns = [
        { name: 'S. No.', key: "s_no", className: "text-start" },
        { name: "Bridge No", key: "bridge_no", className: "text-start" },
        { name: "River", key: "river_name", className: "text-start" },
        { name: "Level", key: "current_level", className: "text-center" },
        { name: "Battery", key: "battery" },
        { name: "Device Status", key: "is_online" },
        { name: "Sensor Status", key: "sensor_status" },

    ];




    return (
        <div className="h-[calc(100vh-96px)] xl:grid  grid-rows-[auto_auto_1fr] ">

            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <HeaderTile title="BR Devices" onSearchChange={setSearchQuery} actions={[
                { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
                { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
                { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
            ]} />


            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4 h-full relative  no-scrollbar  rounded-b-md">

                <HeaderTable columns={BrDashboardTableHeaderData} />
                {filteredDevices.map((device: Device, index) => {
                    device.s_no = index+1;
                    device.battery = `${device.battery}`;
                    device.sensor_status = device.sensor_status && device.is_online;
                    return (
                        (
                            <TableRowV2 data={device} columns={columns} actions={[
                                {
                                    icon: <GrMapLocation />,
                                    onClick: () => console.log("View Map"),
                                },
                                {
                                    icon: <RiRestartLine />,
                                    onClick: () => console.log("Restart Device"),
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
                                    className: ` bg-white px-6 py-1 text-green-500  rounded-full `,
                                },
                            ]} active_uid={activeDetail?.uid || ""} activeContainer={brWlmsDetails(activeDetail)} />
                        )
                    );
                })}

            </div>

        </div>
    );


    function brWlmsDetails(device?: Device | null) {
        return <div className=" relative border border-primary min-w-[720px]   px-4 pt-1 pb-3 rounded-md ">
            <div className=" capitalize absolute bottom-10 right-8 text-2xl text-primary font-bold ">{device?.river_name}({device?.bridge_no})</div>
            <div className="flex relative justify-between bg-black   rounded-md items-center  ">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className=" px-2 py-1   rounded-sm text-black font-semibold text-center" />
                <div className=" mt-4 mr-5">

                    <PrimaryButton onClick={() => {
                        const path = `/wlms/logs/${device?.uid}`;
                        const url = `${window.location.origin}${path}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }}>Logs</PrimaryButton>

                </div>
            </div>

            <div className="min-w-[720px] h-[32vh] pr-4">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>
        </div>;
    }
};

export default Dashboard;
