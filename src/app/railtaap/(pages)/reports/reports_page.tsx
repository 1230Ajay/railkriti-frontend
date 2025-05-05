'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav/navbar';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import DateInput from '@/components/text-fields/DateInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import generatePDF, { usePDF } from 'react-to-pdf';

interface Device {
  km: any;
  location: string | number | readonly string[] | undefined;
  mobile_no: any;
  uid: any;
  mean_temp: any,
  de_stress_temp: any,
  zone: string,
  division: string;
  reading_interval: any;
  section: any;
  bridge_no: string;
  river_name: string;
  temperature_stats: any;
  device_logs: any;
}

enum LogType {
  TEMP,
  TEMP_DATE_WISE,
  DEVICE_STATUS
}

const Reports: React.FC = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [logType, setLogType] = useState<LogType>(LogType.TEMP);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [data, setData] = useState<Device | null>(null);


  useEffect(() => {
    fetchDevices();
    // Set default dates
    const today = new Date();
    const tommaroww = new Date(today);

    tommaroww.setDate(today.getDate() + 1);

    setToDate(formatDate(tommaroww));
    setFromDate(formatDate(today));
  }, []);

  useEffect(() => {
    if (selectedDevice && fromDate && toDate) {
      fetchLogData();
    }
  }, [selectedDevice, logType, fromDate, toDate]);

  const fetchDevices = async () => {
    try {
      const res = await myIntercepter.get(`${conf.RAILTAAP}/api/device`);
      if (res.status === 200) {
        setDevices(res.data);
        setSelectedDevice(res.data[0] || null); // Default to first device if available
      }
    } catch (error) {
      setDevices([]);
      console.error('Error fetching devices:', error);
    }
  };

  const fetchLogData = async () => {
    try {
      if (selectedDevice) {
        const res = await myIntercepter.get(`${conf.RAILTAAP}/api/logs/${selectedDevice.uid}`, { params: { start: fromDate, end: toDate } });
        if (res.status === 200) {
          setData(res.data);
        } else {
          setData(null)
        }
      }
    } catch (error) {
      setData(null)
      console.error('Error fetching log data:', error);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const deviceOptions = devices.map(device => ({
    value: device.location,
    label: `${device.km} ( ${device.location} )`
  }));



  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      // Temporarily apply print styles
      const originalContents = document.body.innerHTML;
      const printContents = printRef.current.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents; // Restore original contents
      window.location.reload(); // Reload to fix event listeners
    }
  };

  const formatDateTime = (utcString: string): { date: string; time: string } => {
    const dateObj = new Date(utcString);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    }).format(dateObj).replace(/\//g, "-"); // Converts "DD/MM/YYYY" to "DD-MM-YYYY"

    const formattedTime = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    }).format(dateObj).replace(",", "").trim();

    return { date: formattedDate, time: formattedTime };
  };


  const groupedData: Record<string, { min_temp: number; max_temp: number; min_time: string; max_time: string }> = {};

  data?.device_logs.forEach((log: any) => {
    const date = new Date(log.created_at).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format

    if (!groupedData[date]) {
      groupedData[date] = {
        min_temp: log.temp,
        max_temp: log.temp,
        min_time: log.created_at,
        max_time: log.created_at
      };
    } else {
      if (log.temp < groupedData[date].min_temp) {
        groupedData[date].min_temp = log.temp;
        groupedData[date].min_time = log.created_at;
      }
      if (log.temp > groupedData[date].max_temp) {
        groupedData[date].max_temp = log.temp;
        groupedData[date].max_time = log.created_at;
      }
    }
  });

  // Convert to final result
  const result = Object.entries(groupedData).map(([date, { min_temp, max_temp, min_time, max_time }]) => ({
    date,
    min_temp,
    min_time: formatDateTime(min_time),
    max_temp,
    max_time: formatDateTime(max_time)
  }));

  const handleLogTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLogType = Number(event.target.value); // Convert the selected value to the enum
    setLogType(selectedLogType);
  };

  return (
    <div className='grid grid-rows-[auto_auto_1fr] mx-4'>

      <div className='h-4'></div>

      <div className="bg-black rounded-md p-4 ">
        <h2 className='font-bold text-xl text-white uppercase pb-2'>Reports</h2>
        <div className="flex flex-col items-center lg:flex-row">
          <form onSubmit={(e) => e.preventDefault()} className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Bridge Select Input */}
            <div className="mb-4 w-full">
              <label htmlFor="logType" className="block text-white font-bold mb-2 ">
                Location:
              </label>
              <div className='bg-gray-800 text-white  py-1 rounded-md pr-2'>
                <select
                  id="device"
                  value={selectedDevice ? selectedDevice.location : ''}
                  onChange={(e) => {
                    const selected = devices.find(device => device.location === e.target.value) || null;
                    setSelectedDevice(selected);
                  }}
                  className="w-full border-none text-white bg-gray-800  px-2 capitalize shadow-sm"
                  required
                >
                  {deviceOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Log Type Select Input */}
            <div className="mb-4 w-full">
              <label htmlFor="logType" className="block text-white font-bold mb-2 ">
                Log Type:
              </label>
              <div className='bg-gray-800 text-white  py-1 rounded-md pr-2'>
                <select
                  id="logType"
                  value={logType}
                  onChange={handleLogTypeChange}
                  className="w-full border-none text-white bg-gray-800  px-2 capitalize shadow-sm"
                  required
                >
                  <option value={LogType.TEMP}>Temperature</option>
                  <option value={LogType.TEMP_DATE_WISE}>Temperature Date wise</option>
                  <option value={LogType.DEVICE_STATUS}>Device Status</option>
                </select>
              </div>
            </div>

            <DateInput
              label="From Date:"
              htmlFor="fromDate"
              value={fromDate}
              onChange={setFromDate}
              className="mb-4 w-full"

            />

            <DateInput
              label="To Date:"
              htmlFor="toDate"
              value={toDate}
              onChange={setToDate}
              className="mb-4 w-full"
            />
          </form>

          <div className='flex items-center flex-col w-48 lg:mb-4'>
            <label className="block text-white font-bold mb-2">{'Generate Report'}</label>
            <div className='flex rounded-md space-x-4 w-fit text-white justify-center items-center'>
              <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 cursor-pointer rounded-sm' onClick={() => generatePDF(printRef, { filename: `railtaap-report-${new Date().toDateString()}` })} />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>
      </div>

      <div className='h-4'></div>

      <div ref={printRef} className="overflow-auto no-scrollbar bg-white  rounded-md py-8 px-8 space-y-8">
        <div className=' flex justify-between'>
          <Image src="/assets/logo/logo3.png" height={100} width={150} alt="Company Logo" />
          <div className='flex flex-col'>
            <h1 className='uppercase font-bold text-[16px] text-primary'>robokriti india private limited</h1>
            <p>235 Phase 4, Star City, Katangi Road,</p>
            <p>Karmeta, Jabalpur, MP, India</p>
            <p>0761 4046444; info@robokriti.com</p>
          </div>
        </div>

        <hr className=' border-primary' />

        <div className="uppercase font-bold text-center text-3xl  font-serif ">
          Railtaap - Rail Temperature Monitoring system
        </div>

        <div className='capitalize  font-bold'>
          <div className='flex '>
            <div className='flex-1'>Location : <span className='font-normal'>{selectedDevice ? selectedDevice.location : ''}</span></div>
            <div className='flex-1'>km : <span className='font-normal'>{selectedDevice ? selectedDevice.km : ''}</span></div>
            <div className='w-56 text-end'>Mobile No : <span className='font-normal'>{selectedDevice ? selectedDevice.mobile_no : ''}</span></div>
          </div>

          <div className='flex'>
            <div className='flex-1'>Mean Temp: <span className='font-normal'>{selectedDevice?.mean_temp}</span></div>
            <div className='flex-1'>De Stresssing Temp: <span className='font-normal'>{selectedDevice?.de_stress_temp}</span></div>
            <div className='w-56 text-end'>reading interval <span className='lowercase'>(min)</span>: <span className='font-normal'>{selectedDevice?.reading_interval}</span></div>
          </div>

          <div className='flex uppercase'>
            <div className='flex-1'>section : <span className='font-normal'>{selectedDevice?.section?.name}</span></div>
            <div className='flex-1'>division : <span className='font-normal'>{selectedDevice?.section?.division?.name}</span></div>
            <div className='w-56 text-end'>zone : <span className='font-normal'>{selectedDevice?.section?.division?.zone?.zonal_code}</span></div>
          </div>

          <hr className=' my-4  border-primary' />
          <div className=' flex justify-between'>
            <div>
              Min: {data?.temperature_stats?.min?.temp ?? 'N/A'}°C   {' - '}
              {data?.temperature_stats?.min?.created_at
                ? new Date(data.temperature_stats.min.created_at).toLocaleString()
                : 'N/A'}
            </div>

            <div>
              Max: {data?.temperature_stats?.max?.temp ?? 'N/A'}°C   {' - '}
              {data?.temperature_stats?.max?.created_at
                ? new Date(data.temperature_stats.max.created_at).toLocaleString()
                : 'N/A'}
            </div>
          </div>
          <hr className=' mt-4  border-primary' />


          <div className="font-bold uppercase text-center col-span-2 mt-8 text-2xl">{logType===LogType.TEMP?"Temperature":""}{logType===LogType.TEMP_DATE_WISE?"Temperature Date Wise":""}{logType===LogType.DEVICE_STATUS?"Device Status":""}</div>
          <div className='flex justify-center text-sm space-x-1'>
            <div className=''>( From {fromDate} To {toDate} )</div>
          </div>
        </div>
        {
          logType == LogType.TEMP ? <table className="table-auto w-full text-sm text-left text-black mt-8">
            <thead className="font-semibold border-y-2  text-primary text-center bg-gray-100">
              <tr>
                <th className="w-1/12 p-2">S.no.</th>
                <th className="w-3/12 p-2">Date</th>
                <th className="w-3/12 p-2">Time</th>
                <th className="w-4/12 p-2">Temperature</th>
              </tr>
            </thead>
            <tbody className='text-center  '>
              {data && data.device_logs.map((log: any, index: any) => (
                <tr key={index} className=' border-b border-primary'>
                  <td className=" p-2">{index + 1}</td>
                  <td className=" p-2"> {formatDateTime(log.created_at).date}</td>
                  <td className=" p-2"> {formatDateTime(log.created_at).time}</td>
                  <td className=" p-2">{log.temp}°C</td>
                </tr>
              ))}
            </tbody>
          </table> : null}

          {
          logType == LogType.TEMP_DATE_WISE ? <table className="table-auto w-full text-sm text-left text-black mt-8">
            <thead className="font-semibold border-y-2  text-primary text-center bg-gray-100">
              <tr>
                <th className="w-1/12 p-2">S.no.</th>
                <th className="w-3/12 p-2">Date</th>
                <th className="w-3/12 p-2">Min Temp (Time)</th>
                <th className="w-4/12 p-2">Max Temp (Time)</th>
              </tr>
            </thead>
            <tbody className='text-center  '>
              {result && result.map((log: any, index: any) => (
                <tr key={index} className=' border-b border-primary'>
                  <td className=" p-2">{index + 1}</td>
                  <td className=" p-2"> {log.date}</td>
                  <td className=" p-2"> {log.min_temp}°C ({log.min_time.time})</td>
                  <td className=" p-2">{log.max_temp}°C ({log.max_time.time})</td>
                </tr>
              ))}
            </tbody>
          </table> : null}


        { logType==LogType.DEVICE_STATUS ? <table className=" table-auto w-full text-sm text-left  text-black mt-8">
          <thead className="border-y-2 font-semibold text-primary text-center bg-gray-100">
            <tr>
              <th className=" w-1/12 p-2">S.no.</th>
              <th className=" w-3/12 p-2">Date / Time</th>
              <th className=" w-4/12 p-2">Device Status</th>
            </tr>
          </thead>
          <tbody className='text-center  border-primary'>
            {data && data.device_logs.map((log: any, index: any) => {
              // Initialize the previous status to something that won't match
              const prevStatus = index > 0 ? data.device_logs[index - 1].device_status : null;
              const showStatus = prevStatus === null || prevStatus !== log.device_status;

              return (
                showStatus ? <tr  key={index} className=' border-b border-primary'>
                  <td className=" p-2">{index + 1}</td>
                  <td className=" p-2">
                    {formatDateTime(log.created_at).date}
                  </td>
                  {
                    <td className="  p-2">
                      {log.device_status ? log.sensor_status ? "Device Online" : "Sensor Error" : "Device Offline"}
                    </td>
                  }
                </tr> : <></>
              );
            })}
          </tbody>
        </table>:null
        }

      </div>
      <div className='h-4'></div>
    </div>
  );
};

export default Reports;