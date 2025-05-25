'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import NavBar from '@/components/nav/navbar';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import DateInput from '@/components/text-fields/DateInput';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import generatePDF from 'react-to-pdf';
import * as XLSX from 'xlsx';

interface Device {
  mobile_no: any;
  uid: any;
  danger_level: any;
  rail_level: any;
  reading_interval: any;
  section: any;
  bridge_no: string;
  river_name: string;
}

interface LogData {
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

const Reports: React.FC = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [logType, setLogType] = useState('water level');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [data, setData] = useState<LogData[]>([]);

  const LogTypeOption = [
    'water level', 'device & sensor status'
  ]

  useEffect(() => {
    fetchDevices();
    // Set default dates
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    setToDate(formatDate(today));
    setFromDate(formatDate(yesterday));
  }, []);

  useEffect(() => {
    if (selectedDevice && fromDate && toDate) {
      fetchLogData();
    }
  }, [selectedDevice, logType, fromDate, toDate]);

  const fetchDevices = async () => {
    try {
      const res = await myIntercepter.get(`${conf.BR_WLMS}/api/device`);
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
        const res = await myIntercepter.get(`${conf.BR_WLMS}/api/logs/${selectedDevice.uid}`, {
          params: { start: fromDate, end: toDate }
        });
        if (res.status === 200) {
          setData(res.data.device_logs);
        } else {
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
    value: device.bridge_no,
    label: `${device.river_name} (${device.bridge_no})`
  }));

  const formatUtcDate = (utcDate: string | number | Date): string => {
    const date = new Date(utcDate);

    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
  };



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

  const exportToExcel = () => {
    if (!printRef.current) return;

    // Extract all text content from divs and organize into rows
    const excelData = [];

    // 1. Add Company Header
    excelData.push(["ROBOKRITI INDIA PRIVATE LIMITED"]);
    excelData.push(["235 Phase 4, Star City, Katangi Road,"]);
    excelData.push(["Karmeta, Jabalpur, MP, India"]);
    excelData.push(["0761 4046444; info@robokriti.com"]);
    excelData.push([]); // Empty row

    // 2. Add Report Title
    excelData.push(["BRIDGE WATER LEVEL MONITORING SYSTEM (BR-WLMS)"]);
    excelData.push([]);

    // 3. Add Bridge Details
    excelData.push([
      `Bridge No: ${selectedDevice?.bridge_no || ''}`,
      `River Name: ${selectedDevice?.river_name || ''}`,
      `Mobile No: ${selectedDevice?.mobile_no || ''}`
    ]);

    excelData.push([
      `Rail Level (MSL): ${selectedDevice?.rail_level || ''}`,
      `Danger Level (MSL): ${selectedDevice?.danger_level || ''}`,
      `Reading Interval (min): ${selectedDevice?.reading_interval || ''}`
    ]);

    excelData.push([
      `Section: ${selectedDevice?.section?.name || ''}`,
      `Division: ${selectedDevice?.section?.division?.name || ''}`,
      `Zone: ${selectedDevice?.section?.division?.zone?.zonal_code || ''}`
    ]);

    excelData.push([]);

    // 4. Add Data Table Header
    excelData.push([
      logType === "water level"
        ? "WATER LEVEL DATA"
        : "DEVICE & SENSOR STATUS"
    ]);
    excelData.push([`(From ${fromDate} To ${toDate})`]);
    excelData.push([]);

    // 5. Add Table Data
    if (logType === "water level") {
      excelData.push([
        "S.No.",
        "Date/Time",
        "Water Level From MSL",
        "Water Level From Danger Level"
      ]);

      data?.forEach((log, index) => {
        excelData.push([
          index + 1,
          formatUtcDate(log.created_at),
          log.wl_msl.toFixed(2),
          log.level.toFixed(2)
        ]);
      });
    } else {
      excelData.push([
        "S.No.",
        "Date/Time",
        "Status"
      ]);

      data?.forEach((log, index) => {
        if (index === 0 || log.device_status !== data[index - 1].device_status) {
          excelData.push([
            index + 1,
            formatUtcDate(log.created_at),
            log.device_status
              ? log.sensor_status
                ? "Device Online"
                : "Sensor Error"
              : "Device Offline"
          ]);
        }
      });
    }

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Export
    XLSX.writeFile(wb, "Bridge_Report.xlsx");
  };

  return (
    <div className='grid grid-rows-[auto_auto_1fr] h-screen'>
      <div className="bg-black rounded-md p-4 mt-4 mx-4">
        <h2 className='font-bold text-xl text-white uppercase pb-2'>Reports</h2>
        <div className="flex flex-col items-center lg:flex-row">
          <form onSubmit={(e) => e.preventDefault()} className="w-full grid md:grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Bridge Select Input */}
            <div className="mb-4 w-full">
              <label htmlFor="logType" className="block text-white font-bold mb-2 ">
                Bridge:
              </label>
              <div className='bg-gray-800 text-white  py-1 rounded-md pr-2'>
                <select
                  id="device"
                  value={selectedDevice ? selectedDevice.bridge_no : ''}
                  onChange={(e) => {
                    const selected = devices.find(device => device.bridge_no === e.target.value) || null;
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
                  onChange={(e) => {
                    setLogType(e.target.value)
                  }}
                  className="w-full border-none text-white bg-gray-800  px-2 capitalize shadow-sm"
                  required
                >
                  <option value="water level">water level</option>
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
              <RiFileExcel2Fill onClick={exportToExcel} className='bg-green-600 h-8 w-8 p-1 rounded-sm cursor-pointer' />
              <BsFileEarmarkPdfFill
                className='bg-red-600 h-8 w-8 p-1 rounded-sm cursor-pointer'
                title="Export to PDF"
                onClick={() => generatePDF(printRef, { filename: `br-wlms-report-${new Date().toDateString()}` })}
              />
              <BsFillPrinterFill
                className='bg-blue-600 h-8 w-8 p-1 rounded-sm cursor-pointer'
                title="Print Report"
                onClick={handlePrint}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={printRef} className='bg-white  mt-4 mx-4 mb-4 rounded-md py-8 px-8 space-y-8'>
        <div className=" overflow-scroll no-scrollbar ">
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
            bridge water level monitoring system (BR-WLMS)
          </div>

          <div className='capitalize  font-bold'>
            <div className='flex '>
              <div className='flex-1'>bridge no : <span className='font-normal'>{selectedDevice ? selectedDevice.bridge_no : ''}</span></div>
              <div className='flex-1'>river name : <span className='font-normal'>{selectedDevice ? selectedDevice.river_name : ''}</span></div>
              <div className='w-56 text-end'>Mobile No : <span className='font-normal'>{selectedDevice ? selectedDevice.mobile_no : ''}</span></div>
            </div>

            <div className='flex'>
              <div className='flex-1'>Rail level<span >(MSL)</span>: <span className='font-normal'>{selectedDevice?.rail_level}</span></div>
              <div className='flex-1'>danger level <span >(MSL)</span>: <span className='font-normal'>{selectedDevice?.danger_level}</span></div>
              <div className='w-56 text-end'>reading interval <span className='lowercase'>(min)</span>: <span className='font-normal'>{selectedDevice?.reading_interval}</span></div>
            </div>

            <div className='flex uppercase'>
              <div className='flex-1'>section : <span className='font-normal'>{selectedDevice?.section?.name}</span></div>
              <div className='flex-1'>division : <span className='font-normal'>{selectedDevice?.section?.division?.name}</span></div>
              <div className='w-56 text-end'>zone : <span className='font-normal'>{selectedDevice?.section?.division?.zone?.zonal_code}</span></div>
            </div>




            <div className="font-bold uppercase text-center col-span-2 mt-8 text-2xl">{logType == "water level" ? "water level data" : 'Device & Sensor Status'}</div>
            <div className='flex justify-center text-sm space-x-1'>
              <div className=''>( From {fromDate} To {toDate} )</div>
            </div>
          </div>
          {
            logType == "water level" ? <table className="border-collapse table-auto w-full text-sm text-left border text-black mt-8">
              <thead className="border-2 font-semibold  text-primary text-center bg-gray-100">
                <tr>
                  <th className="border w-1/12 p-2">S.no.</th>
                  <th className="border w-3/12 p-2">Date / Time</th>
                  <th className="border w-4/12 p-2">Water Level From MSL</th>
                  <th className="border w-4/12 p-2">Water Level From Danger level</th>

                </tr>
              </thead>
              <tbody className='text-center  '>
                {data && data.map((log, index) => (
                  <tr key={index}>
                    <td className="border border-primary/50 p-2">{index + 1}</td>
                    <td className="border border-primary/50 p-2"> {formatUtcDate(log.created_at)}</td>
                    <td className="border border-primary/50 p-2">{log.wl_msl.toFixed(2)}</td>
                    <td className="border border-primary/50 p-2">{log.level.toFixed(2)}</td>

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
                  {data && data.filter((log, index) => {
                    const prevStatus = index > 0 ? data[index - 1].device_status : null;
                    return prevStatus === null || prevStatus !== log.device_status;
                  }).map((log, index) => {

                    return (
                      <tr key={index} className=''>
                        <td className="border border-primary/50 p-2">{index + 1}</td>
                        <td className="border border-primary/50 p-2">
                          {formatUtcDate(log.created_at)}
                        </td>
                        {
                          <td className="border border-primary/50 p-2">
                            {log.device_status ? log.sensor_status ? "Device Online" : "Sensor Error" : "Device Offline"}
                          </td>
                        }
                      </tr>
                    );
                  })}
                </tbody>

              </table>}
        </div>
      </div>
    </div>
  );
};

export default Reports;