'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav/navbar';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import DateInput from '@/components/text-fields/DateInput';
import SelectInput from '@/components/text-fields/SelectInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';

// Define the structure of a Device
interface Device {
  name: string;
  mobile_no: string;
  uid: string;
  isUpside: boolean;
  section: {
    name: string;
    division: {
      name: string;
      divisional_code:string;
      zone: {
        name: string;
        zonal_code:string;
      };
    };
  };
}

// Define the structure of Log Data
interface LogData {
  actions: string;
  isTrainDetected: boolean;
  sensor_status: boolean;
  device_status: boolean;
  device_uid: string;
  created_at: string | number | Date;
  serial_no: string;
  timestamp: string;
  data: string;
  battery: string;
}

const Reports: React.FC = (): JSX.Element => {
  // State variables
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [logType, setLogType] = useState<'Train Detection' | 'device & sensor status'>('Train Detection');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [data, setData] = useState<LogData[]>([]);
  const [deviceType, setDeviceType] = useState<'transmitter' | 'receiver'>('transmitter');
 
  // Options for Log Type and Device Type
  const LogTypeOptions = [
    { value: 'Train Detection', label: 'Train Detection' },
    { value: 'device & sensor status', label: 'Device & Sensor Status' }
  ];

  const DeviceTypeOptions = [
    { uid: 'transmitter', name: 'transmitter', value: 'Transmitter' },
    { uid: 'receiver', name: 'receiver', value: 'Receiver' }
  ];

  // Initialize devices and dates on component mount or device type change
  useEffect(() => {
    fetchDevices();
    initializeDates();
    setSelectedDevice(null); // Reset selected device when switching device types
    setData([]); // Clear log data when switching device types
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType]);


  // Fetch log data when relevant state changes
  useEffect(() => {
    if (selectedDevice && fromDate && toDate) {
      fetchLogData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDevice, logType, fromDate, toDate, deviceType]);

  // Function to initialize fromDate and toDate
  const initializeDates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    setToDate(formatDate(today));
    setFromDate(formatDate(yesterday));
  };

  // Function to fetch devices based on device type
  const fetchDevices = async () => {
    try {
      const device = deviceType === 'transmitter' ? conf.SAATHI_TX : conf.SAATHI_RX;
      const res = await myIntercepter.get(`${device}/api/device`);
      if (res.status === 200) {
        setDevices(res.data);
        setSelectedDevice(res.data[0] || null); // Select the first device by default

      }
    } catch (error) {
      setDevices([]);
      setSelectedDevice(null);

      console.error('Error fetching devices:', error);
    }
  };

  // Function to fetch log data based on selected device and date range
  const fetchLogData = async () => {
    try {
      setData([]);
      if (selectedDevice) {
        const device = deviceType === 'transmitter' ? conf.SAATHI_TX : conf.SAATHI_RX;
        const res = await myIntercepter.get(`${device}/api/logs/${selectedDevice.uid}`, {

          params: {
            start: fromDate,
            end: toDate
          }
        });
        if (res.status === 200) {
          setData(res.data.device_logs);
   
        } else {
          setData([]);
        }
      }
    } catch (error) {
      setData([]);

      console.error('Error fetching log data:', error); // Log detailed error
    }
  };


  // Helper function to format dates as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Prepare device options for the select input
  const deviceOptions = devices.map(device => ({
    value: device.uid,
    label: device.name
  }));

  // Function to convert UTC date to IST
  const convertUtcToIst = (utcDate: string | number | Date): string => {
    const date = new Date(utcDate);
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000); // IST is UTC+5:30
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Title configuration for NavBar
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

  return (
    <div className='grid grid-rows-[auto_auto_1fr] min-h-screen'>

      {/* Filters Section */}
      <div className="bg-black rounded-md p-4 mt-4 mx-4">
        <h2 className='font-bold text-xl text-white uppercase pb-2'>Reports</h2>
        <div className="flex flex-col items-center lg:flex-row">
          <form onSubmit={(e) => e.preventDefault()} className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-5">
            {/* Device Type Select Input */}
            <SelectInput
              label='Device Type'
              value={deviceType}
              onChange={(e) => setDeviceType(e)}
              options={DeviceTypeOptions}
              className="mb-4 w-full"
            />

            {/* Device Select Input */}
            <div className="mb-4 w-full">
              <label htmlFor="device" className="block text-white font-bold mb-2">
                Device:
              </label>
              <div className='bg-gray-800 text-white py-1 rounded-md pr-2'>
                <select
                  id="device"
                  value={selectedDevice ? selectedDevice.uid : ''}
                  onChange={(e) => {
                    const selected = devices.find(device => device.uid === e.target.value) || null;
                    setSelectedDevice(selected);
                  }}
                  className="w-full border-none text-white bg-gray-800 px-2 capitalize shadow-sm"
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
              <label htmlFor="logType" className="block text-white font-bold mb-2">
                Log Type:
              </label>
              <div className='bg-gray-800 text-white py-1 rounded-md pr-2'>
                <select
                  id="logType"
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as 'Train Detection' | 'device & sensor status')}
                  className="w-full border-none text-white bg-gray-800 px-2 capitalize shadow-sm"
                  required
                >
                  {LogTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* From Date Input */}
            <DateInput
              label="From Date:"
              htmlFor="fromDate"
              value={fromDate}
              onChange={setFromDate}
              className="mb-4 w-full"
            />

            {/* To Date Input */}
            <DateInput
              label="To Date:"
              htmlFor="toDate"
              value={toDate}
              onChange={setToDate}
              className="mb-4 w-full"
            />
          </form>

          {/* Report Generation Icons */}
          <div className='flex items-center flex-col w-48 lg:mb-4'>
            <label className="block text-white font-bold mb-2">Generate Report</label>
            <div className='flex rounded-md space-x-4 w-fit text-white justify-center items-center'>
              <RiFileExcel2Fill
                className='bg-green-600 h-8 w-8 p-1 rounded-sm cursor-pointer'
                title="Export to Excel"
                onClick={() => {/* Implement Excel export functionality */ }}
              />
              <BsFileEarmarkPdfFill
                className='bg-red-600 h-8 w-8 p-1 rounded-sm cursor-pointer'
                title="Export to PDF"
                onClick={handlePrint}
              />
              <BsFillPrinterFill
                className='bg-blue-600 h-8 w-8 p-1 rounded-sm cursor-pointer'
                title="Print Report"
                onClick={()=>{}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div ref={printRef} className="overflow-auto no-scrollbar bg-white mt-4 mx-4 mb-4 rounded-md py-8 px-8 space-y-8">
        {/* Header with Logo and Company Info */}
        <div className='flex justify-between'>
          <Image src="/assets/logo/logo3.png" height={100} width={150} alt="Company Logo" />
          <div className='flex flex-col ml-4'>
            <h1 className='uppercase font-bold text-[16px] text-primary'>Robokriti India Private Limited</h1>
            <p>235 Phase 4, Star City, Katangi Road,</p>
            <p>Karmeta, Jabalpur, MP, India</p>
            <p>0761 4046444; info@robokriti.com</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="uppercase   font-semibold text-center text-3xl font-serif border-t pt-6 border-primary">
          Saathi (Pre Warning System)
        </div>

        {/* Device and Report Information */}
        <div className='capitalize font-semibold space-y-2'>
          <div className='flex'>
            <div className='flex-1'>Name: <span className='font-normal'>{selectedDevice ? selectedDevice.name : '-'}</span></div>
            <div className='flex-1'>Type: <span className='font-normal'>{deviceType === 'transmitter' ? "Transmitter" : 'Receiver'}</span></div>
            <div className='w-56 text-end'>Mobile No: <span className='font-normal'>{selectedDevice ? selectedDevice.mobile_no : '-'}</span></div>
          </div>

          <div className='flex'>
            <div className='flex-1'>Direction: <span className='font-normal'>{selectedDevice?.isUpside ? "UP" : "Down"}</span></div>
            <div className='flex-1'>Group: <span className='font-normal'>{selectedDevice?.name.slice(0,-3)}</span></div>
            <div className='w-56 text-end'> {/* Placeholder for additional info */}</div>
          </div>

          <div className='flex'>
            <div className='flex-1'>Section: <span className='font-normal'>{selectedDevice?.section.name}</span></div>
            <div className='flex-1'>Division: <span className='font-normal'>{selectedDevice?.section.division.divisional_code}</span></div>
            <div className='w-56 text-end'>Zone: <span className='font-normal'>{selectedDevice?.section.division.zone.zonal_code}</span></div>
          </div>

          {/* Report Type and Date Range */}
          <div className="font-semibold uppercase text-center mt-8 text-2xl">
            {logType === "Train Detection" ? "Train Detection Data" : 'Device & Sensor Status'}
          </div>
          <div className='flex justify-center text-sm space-x-1'>
            <div>( From {fromDate} To {toDate} )</div>
          </div>
        </div>


        {/* Data Table for tx */}
        {deviceType == "transmitter" ? <div>
          {logType === "Train Detection" ? (
            <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
              <thead className="border-2 font-semibold text-primary text-center bg-gray-100">
                <tr>
                  <th className="border p-2">S.no.</th>
                  <th className="border p-2">Date / Time</th>
                  <th className="border p-2">Train Detection</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {Array.isArray(data) && data.filter((log) => log.isTrainDetected).map((log, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{convertUtcToIst(log.created_at)}</td>
                    <td className="border p-2">{log.isTrainDetected ? "Train Detected" : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
              <thead className="border-2 font-semibold text-primary text-center bg-gray-100">
                <tr>
                  <th className="border p-2">S.no.</th>
                  <th className="border p-2">Date / Time</th>
                  <th className="border p-2">Device Status</th>
                  <th className="border p-2">Sensor Status</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.map((log, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{convertUtcToIst(log.created_at)}</td>
                    <td className="border p-2">
                      {log.device_status ? "Device Online" : "Device Offline"}
                    </td>
                    <td className="border p-2">
                      {log.sensor_status ? "Sensor Working" : "Sensor Error"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div> :
          <div>
            {logType === "Train Detection" ? (
              <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
                <thead className="border-2 font-semibold text-primary text-center bg-gray-100">
                  <tr>
                    <th className="border p-2">S.no.</th>
                    <th className="border p-2">Date / Time</th>
                    <th className="border p-2">Train Detection & Acknowledgement</th>
                  </tr>
                </thead>


                <tbody className="text-center">
                  {data&& data.filter((log) => log.actions !== "ONLINE" && log.actions !== "OFFLINE" && log.actions !== "LOG").map((log, index) => (
                    <tr key={index}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{convertUtcToIst(log.created_at)}</td>
                      <td className="border p-2">
                        {log.actions}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
                <thead className="border-2 font-semibold text-primary text-center bg-gray-100">
                  <tr>
                    <th className="border p-2">S.no.</th>
                    <th className="border p-2">Date / Time</th>
                    <th className="border p-2">Device Status</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {Array.isArray(data) && data.length > 0 ? (
                    data
                      .filter((log) => log.actions === "ONLINE" || log.actions === "OFFLINE")
                      .map((log, index) => (
                        <tr key={index}>
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{convertUtcToIst(log.created_at)}</td>
                          <td className="border p-2">{log.actions}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td >No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>}
      </div>
    </div>
  );
};

export default Reports;
