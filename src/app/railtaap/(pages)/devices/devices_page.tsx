'use client'
import React, { useEffect, useState } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import NavBar from '@/components/nav/navbar';
import conf from '@/lib/conf/conf';
import RailTaapDeviceAdd from '@/components/forms/railtaap/railTaapDeviceAdd';
import RailTaapDeviceUpdate from '@/components/forms/railtaap/railTaapDeviceUpdate';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { RailtaapDeviceTableHeaderData } from '@/lib/data/railtaap/data.device-page-header';
import TableRow from '@/components/tiles/tile.table-row';

interface Device {
  km: any;
  location: any;
  uid: any;
  mobile_no: string;
  reading_interval: string;
  section: any;
  division: any;
  zone: any;
  isActive: boolean;
  imei?: string;
  latitude?: string;
  longitude?: string;
  start_date?: string;
  end_date?: string;
  rail_level?: string;
  danger_level?: string;
  sensor_level?: string;
  section_name: any;
  zone_name: any;
  division_name: any;
}

const DevicePage: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    try {
      const response = await myIntercepter.get(`${conf.RAILTAAP}/api/device`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDevices = devices.filter(device =>
    device.location?.toLowerCase().includes(searchTerm.toLowerCase()) || device.km?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (device: Device) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };

  const activateDeactivate = async (uid: string, status: boolean) => {
    try {
      // Optimistically update the device state
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.uid === uid ? { ...device, isActive: status } : device
        )
      );

      const response = await myIntercepter.put(`${conf.RAILTAAP}/api/device/${uid}`, {
        isActive: status,
      });

      if (response.status !== 200) {
        // Revert the state if the API request fails
        toast.error("Something went wrong while changing device activation status.");
        setDevices(prevDevices =>
          prevDevices.map(device =>
            device.uid === uid ? { ...device, isActive: !status } : device
          )
        );
      }
    } catch (error) {
      // Handle error, revert the state
      toast.error("An error occurred while changing device activation status.");
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.uid === uid ? { ...device, isActive: !status } : device
        )
      );
    }
  };


  const columns = [

    { name: "Bridge No", key: "km", className: "text-start" },
    { name: "River", key: "location", className: "text-start" },
    { name: "Mobile", key: "mobile_no", className: "text-start" },
    { name: "interval", key: "reading_interval", className: "text-center" },
    { name: "Section", key: "section_name", className: "text-center" },
    { name: "Division", key: "division_name", className: "text-center" },
    { name: "Zone", key: "zone_name", className: "text-center" },
  ];

  return (
    <div className=' grid h-[calc(100vh-80px)] grid-rows-[auto_1fr] '>
      <HeaderTile title="Devices" onSearchChange={setSearchTerm} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddDevicePopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className="bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md">
        <HeaderTable columns={RailtaapDeviceTableHeaderData} />

        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => {
            device.section_name = device.section.name;
            device.division_name = device.section.division.divisional_code;
            device.zone_name = device.section.division.zone.zonal_code;
            return (
              <TableRow data={device} columns={columns} actions={[
                {
                  icon: device.isActive ? (
                    <CgToggleOff className='text-green-400 text-4xl' />
                  ) : (
                    <CgToggleOn className='text-primary text-4xl' />
                  ),
                  onClick: () => activateDeactivate(device.uid, !device.isActive)
                },
                {
                  icon: <TbListDetails className=' bg-white text-green-500 w-12 rounded-full py-1 text-2xl' />,
                  onClick: () => openUpdateForm(device)
                }
              ]} />
            )
          })}
        </div>
      </div>

      <Modal isOpen={addDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          <RailTaapDeviceAdd onClose={() => setAddDevicePopUpState(false)}></RailTaapDeviceAdd>
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <RailTaapDeviceUpdate device={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>
    </div>
  );
};

export default DevicePage;


{/* <p className='text-4xl flex justify-center'>
{device.isActive ? (
  <CgToggleOff onClick={() => activateDeactivate(device.uid, !device.isActive)} className='text-green-400' />
) : (
  <CgToggleOn onClick={() => activateDeactivate(device.uid, !device.isActive)} className='text-primary' />
)}
</p>
<div className='flex h-full items-center justify-center'>
<button
  onClick={() => openUpdateForm(device)}
  className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
>
  <TbListDetails />
</button>
</div> */}