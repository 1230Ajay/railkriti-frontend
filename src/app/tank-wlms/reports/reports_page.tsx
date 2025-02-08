'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav/navbar';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import DateInput from '@/components/text-fields/DateInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';

interface Device {
  km: any;
  location: string | number | readonly string[] | undefined;
  mobile_no: any;
  uid: any;
  mean_temp:any,
  de_stress_temp:any,
  zone:string,
  division:string;
  reading_interval: any;
  section: any;
  bridge_no: string;
  river_name: string;
}

interface LogData {
  temp: any;
  sensor_status: any;
  device_status: any;
  level: any;
  wl_msl: any;
  device_uid: string;
  created_at: string | number | Date;
  serial_no: string;
  timestamp: string;
  data: string;
  battery: string;
}

const Reports: React.FC = ():JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [logType, setLogType] = useState('Tank Level');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [data, setData] = useState<LogData[]>([]);

  const LogTypeOption = [
    'Tank Level' , 'device & sensor status'
  ]

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
      const res = await myIntercepter.get(`${conf.TANK_WLMS}/api/device`);
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
        const res = await myIntercepter.post(`${conf.TANK_WLMS}/api/logs/report`, { uid: selectedDevice.uid, fromDate: fromDate, toDate: toDate });
        if (res.status === 200) {
          setData(res.data);
        }else{
          setData([])
        }
      }
    } catch (error) {
      setData([])
      console.error('Error fetching log data:', error);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const deviceOptions = devices.map(device => ({
    value: device.km,
    label: `${device.km} ( ${device.location} )`
  }));

  const convertUtcToIst = (utcDate: string | number | Date): string => {
    const date = new Date(utcDate);
    const offset = 5.5 * 60; // IST is UTC+5:30
    const istDate = new Date(date.getTime() - offset);
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false, // Use 24-hour format
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className='grid grid-rows-[auto_auto_1fr] h-screen'>
      <NavBar title={Titles.TankWlmsTitle} />

      <div className="bg-black rounded-md p-4 mt-4 mx-4">
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
                  {deviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
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
                  onChange={(e) =>{ setLogType(e.target.value)
                   }}
                  className="w-full border-none text-white bg-gray-800  px-2 capitalize shadow-sm"
                  required
                >
                  <option value="Tank Level">Tank Level</option>
                  <option value="device & sensor status">Status</option>
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
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-auto no-scrollbar bg-white mt-4 mx-4 mb-4 rounded-md py-8 px-8 space-y-8">
        <div className=' flex justify-between'>
          <Image src="/assets/logo/logo3.png" height={100} width={150} alt="Company Logo" />
          <div className='flex flex-col ml-4'>
            <h1 className='uppercase font-bold text-[16px] text-primary'>robokriti india private limited</h1>
            <p>235 Phase 4, Star City, Katangi Road,</p>
            <p>Karmeta, Jabalpur, MP, India</p>
            <p>0761 4046444; info@robokriti.com</p>
          </div>
        </div>

        <div className="uppercase font-bold text-center text-3xl font-serif border-t pt-6 border-primary">
         Tank Water Level Monitoring System
        </div>

        <div className='capitalize  font-bold'>
          <div className='flex '>
            <div className='flex-1'>km : <span className='font-normal'>{selectedDevice ? selectedDevice.km : ''}</span></div>
            <div className='flex-1'>Location : <span className='font-normal'>{selectedDevice ? selectedDevice.location : ''}</span></div>
            <div className='w-56 text-end'>Mobile No : <span className='font-normal'>{selectedDevice ? selectedDevice.mobile_no : ''}</span></div>
          </div>

  

          <div className='flex uppercase'>
            <div className='flex-1'>section : <span className='font-normal'>{selectedDevice?.section}</span></div>
            <div className='flex-1'>division : <span className='font-normal'>{selectedDevice?.division}</span></div>
            <div className='w-56 text-end'>zone : <span className='font-normal'>{selectedDevice?.zone}</span></div>
          </div>




          <div className="font-bold uppercase text-center col-span-2 mt-8 text-2xl">{logType == "Tank Level" ?"Tank Level data":'Device & Sensor Status' }</div>
          <div className='flex justify-center text-sm space-x-1'>
            <div className=''>( From {fromDate} To {toDate} )</div>
          </div>
        </div>
        {
          logType == "Tank Level" ? <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
            <thead className="border-2 font-semibold  text-primary text-center bg-gray-100">
              <tr>
                <th className="border w-1/12 p-2">S.no.</th>
                <th className="border w-3/12 p-2">Date / Time</th>
                <th className="border w-4/12 p-2">Temp</th>
              </tr>
            </thead>
            <tbody className='text-center  '>
              {data && data.map((log, index) => (
                <tr key={index}>
                  <td className="border border-primary/50 p-2">{index + 1}</td>
                  <td className="border border-primary/50 p-2"> {convertUtcToIst(log.created_at)}</td>
                  <td className="border border-primary/50 p-2">{log.temp}</td>
                </tr>
              ))}
            </tbody>
          </table> :
            <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
              <thead className="border-2 font-semibold text-primary text-center bg-gray-100">
                <tr>
                  <th className="border w-1/12 p-2">S.no.</th>
                  <th className="border w-3/12 p-2">Date / Time</th>
                  <th className="border w-4/12 p-2">Status</th>


                </tr>
              </thead>
              <tbody className='text-center  border-primary'>
                {data && data.map((log, index) => {
                  // Initialize the previous status to something that won't match
                  const prevStatus = index > 0 ? data[index - 1].device_status : null;
                  const showStatus = prevStatus === null || prevStatus !== log.device_status;

                  return (
                    showStatus?  <tr key={index} className=''>
                      <td className="border border-primary/50 p-2">{index + 1}</td>
                      <td className="border border-primary/50 p-2">
                        {convertUtcToIst(log.created_at)}
                      </td>
                      {
                        <td className="border border-primary/50 p-2">
                          {log.device_status ? log.sensor_status ? "Device Online" : "Sensor Error" : "Device Offline"}
                        </td>
                      }
                    </tr>:<></>
                  );
                })}
              </tbody>

            </table>}
      </div>
    </div>
  );
};

export default Reports;