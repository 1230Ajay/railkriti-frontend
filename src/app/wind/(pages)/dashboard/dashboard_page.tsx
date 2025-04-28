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

import { useDispatch, useSelector } from "react-redux";
import {  enableButton, setTimer } from "@/features/device/deviceSlice";
import { toast } from "react-toastify";
import DevicesStatics from "@/components/DevicesStatics";
import { PrimaryButton } from "@/components/buttons/primarybutton";
import conf from "@/lib/conf/conf";
import myIntercepter from "@/lib/interceptor";
import { HeaderTile } from "@/components/headers/header.tile";
import HeaderTable from "@/components/headers/header.table";
import TableRowV2 from "@/components/tiles/tile.table-row-v2";
import { WindDashboardTableHeaderData } from "@/lib/data/wind/data.dashboard-header";




import mqtt from 'mqtt';



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
        const client = mqtt.connect(conf.MQTT_URL, {
          protocolId: 'MQTT',
          protocolVersion: 4, // MQTT v3.1.1
          username: 'robo',
          password: 'rkirail',
          keepalive: 30,
          wsOptions: {
            protocol: 'mqtt',
          },
        });
      
        client.on('connect', () => {
          console.log('Connected via MQTT over WebSocket');
          client.subscribe('device/status/wind/#');
          client.subscribe('device/updateui/wind/#');
          client.subscribe('relay/status/wind/#');
        });
      
        client.on('message', (topic, message) => {
          handleMessage(topic,message.toString());
        });
      
      }, []);

      const updateDeviceByUid = (updatedDevice: any) => {
        setDevices(prevDevices =>
          prevDevices.map(device =>
            device.uid === updatedDevice.uid
              ? { ...device, ...updatedDevice }
              : device
          )
        );
      };
      

      const parseData = (input: string) => {
        const [date, time, batteryStr, windSpeedStr, tempStr, sensorStatusStr] = input.split("~");
        return {
          battery: parseFloat(batteryStr),
          wind_speed: parseFloat(windSpeedStr),
          temp: parseFloat(tempStr),
          sensor_status: sensorStatusStr === "1" || false
        };
      }
    

    const handleMessage = async (topic:string,message:string)=>{
        console.log(topic, message);
        const topicParts = topic.split('/');
        if (topicParts.length < 4) {
          console.warn('⚠️ Invalid topic format:', topic);
          return;
        }
        const deviceId = topicParts[3];
    
        if (topic.startsWith('device/status/wind/')) {
          if (message === 'online') {
             updateDeviceByUid({uid:deviceId,is_online:true})
            return;
          } else if (message === 'offline') {
            updateDeviceByUid({uid:deviceId,is_online:false})
            return;
          }
        }

        if (topic.startsWith('relay/status/wind/')) {
            if (message === 'online') {
               updateDeviceByUid({uid:deviceId,relay_status:true})
              return;
            } else if (message === 'offline') {
              updateDeviceByUid({uid:deviceId,relay_status:false})
              return;
            }
          }
  


        if (topic.startsWith('device/updateui/wind/')) {
            var data: any = await parseData(message);
            data.is_online = true;
            updateDeviceByUid({uid:deviceId,...data})
          }
    
    }




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


    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await myIntercepter.get(`${conf.WIND_URL}/device`);
          setDevices(res.data);
        } catch (error) {
          console.error('Error fetching device:', error);
        }
      };
    
      fetchData();
    }, []);
    

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

        const dates = await getDateRange(selectedDate);

        try {
            const response = await myIntercepter.get(`${conf.WIND_URL}/logs/${uid}`, {
                params: dates,
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
            hourlyData[hour] = entry.temp > 0 ? entry.temp : null;
        });
        return hourlyData;
    };

    const handleDateChange = (date: Date | null) => {

        setSelectedDate(date);

    };

    const lineChartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), 
        datasets: [
            {
                label: ' Temp',
                data: chartData,
                borderColor: 'rgba(0, 119, 204, 1)', 
                backgroundColor: 'rgba(0, 119, 204, 0.35)', 
                borderWidth: 3,
                pointBackgroundColor: 'rgba(0, 119, 204, 1)',
                pointBorderColor: 'rgba(0, 119, 204, 1)'

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
                max: 90,
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
                        return `  Temp : ${Math.abs(value.toFixed(2))}`; // Convert negative values to positive for display in tooltips
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
            duration: 2000,
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
            name: "", key: "name", className: " text-start"
        },

        {
            name: "", key: "temp", className: " text-start"
        },
        {
            name: "", key: "wind_speed", className: " text-start"
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
        <div className="h-[calc(100vh-80px)] xl:grid grid-rows-[auto_auto_1fr] ">

            <DevicesStatics totalDevices={totalDevices} activeDevices={activeDevices} onlineDevices={onlineDevices} offlineDevices={offlineDevices} />

            <HeaderTile title="Devices" onSearchChange={setSearchQuery} actions={[
                { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
                { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
                { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
            ]} />


            <div className=" overflow-auto pb-4 text-white bg-black mx-4 mb-4 px-4  relative  no-scrollbar  rounded-b-md">
                <HeaderTable columns={WindDashboardTableHeaderData} />

                {filteredDevices.map((device, index) => {
                    const formattedDevice = {
                        ...device,
                        s_no: index + 1,
                        battery: `${device.battery}%`,
                        sensor_status: device.is_online && device.sensor_status,
                        wind_speed:`${device.wind_speed} km/h`,
                        temp: device.temp === -127 ? "--:--" : `${device.temp}°C`
                    };

                    return (
                        <TableRowV2
                            data={formattedDevice}
                            columns={columns}
                            active_uid={activeDetail?.uid || ""}
                            activeContainer={RailtaapChart(device)}
                            actions={[
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
                                        toast.success(`${device.name} (${device.location}) is being restarted`);
                                    },
                                    className: `p-2 rounded-full ${device.relay_status ? 'bg-green-500' : 'bg-gray-500'}`,
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
                                    className: `bg-white px-6 py-1 text-green-500 rounded-full`,
                                },
                            ]}
                        />
                    );
                })}


            </div>


        </div>
    );

    function RailtaapChart(device: any) {
        return <div className=" relative border border-primary min-w-[720px]   px-4 pt-1 pb-3 rounded-md ">
            <div className=" capitalize absolute  bottom-10 right-4 text-2xl text-primary font-bold ">{device.name} ({device.location})</div>
            <div className="flex relative justify-between bg-black  rounded-md items-center  ">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className=" px-2 py-1   rounded-sm text-black font-semibold text-center" />
                <div className=" flex items-center justify-center space-x-4">
                    <PrimaryButton onClick={() => {
                        const path = `/wind/logs/${device.uid}`;
                        const url = `${window.location.origin}${path}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }}>Logs</PrimaryButton>

                </div>
            </div>

            <div className="min-w-[720px] h-[32vh] flex justify-center items-center pr-4 ">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>
        </div>;
    }
};

export default Dashboard;
