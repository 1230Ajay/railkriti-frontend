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
import SaathiDeviceReservationForm from '@/components/forms/saathi/saathiAddForm';
import SaathiDeviceUpdateForm from '@/components/forms/saathi/saathiUpdateFrom';
import conf from '@/lib/conf/conf';
import { useRouter } from 'next/navigation';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import HeaderTable from '@/components/headers/header.table';
import { SaathiDeviceTableHeaderData } from '@/lib/data/saathi/data.device-page-header';
import TableRow from '@/components/tiles/tile.table-row';


interface Device {
  s_no: any;
  uid: string;
  bridge_no: string;
  name: string;
  mobile_no: string;
  reading_interval: string;
  section: {
    sectional_code: string;
    division: {
      divisional_code: string;
      zone: {
        zonal_code: string;
        name: string;
      };
    };
  };
  is_fixed: any,
  installed_at: any;
  isActive: boolean;
  imei?: string;
  latitude?: string;
  longitude?: string;
  start_date?: string;
  end_date?: string;
  rail_level?: string;
  danger_level?: string;
  sensor_level?: string;
  is_single_line?: boolean;
  section_name: string;
  zone_name: string;
  division_name: string;
}
const DevicePage: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showRx, setShowRx] = useState(false); // Initialize as a boolean
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter()


  useEffect(() => {
    getDevice();
  }, [showRx]); // Trigger getDevice when showRx changes

  const getDevice = async () => {
    try {
      const route = showRx ? conf.SAATHI_RX : conf.SAATHI_TX; // Use boolean for condition
      const response = await myIntercepter.get(`${route}/api/device`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openUpdateForm = (device: Device) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };

  const activateDeactivate = async (uid: string, status: boolean) => {
    try {
      const route = showRx ? conf.SAATHI_RX : conf.SAATHI_TX;
      const response = await myIntercepter.put(`${route}/api/device/${uid}`, {
        isActive: status
      });

      if (response.status === 200) {
        const updatedDeviceList = devices.map((device) =>
          device.uid === uid ? { ...device, isActive: status } : device
        );

        setDevices(updatedDeviceList); // Update devices with the correct 'isActive' field
        toast.success('Device status updated successfully');
      } else {
        toast.error("Something went wrong while changing device activation status.");
      }
    } catch (error) {
      toast.error("An error occurred while changing device activation status.");
    }
  };

  const columns = [
    { name: "", key: "s_no", className: "text-start uppercase" },
    { name: "", key: "name", className: "text-start uppercase" },
    { name: "", key: "installed_at", className: "text-start uppercase" },
    { name: "", key: "mobile_no", className: "text-start uppercase" },
    { name: "", key: "section_name", className: "text-center uppercase" },
    { name: "", key: "division_name", className: "text-center uppercase" },
    { name: "", key: "zone_name", className: "text-center uppercase" },
  ];



  return (
    <div className='grid h-[calc(100vh-80px)] grid-rows-[auto_1fr]'>
      <div className="flex justify-between max-h-16 items-center mx-4 py-4  bg-black rounded-t-md mt-4 px-4 ">
        <div className="  transition-all space-x-2 text-gray-400"><button onClick={() => {
          setShowRx(false);
          setSearchQuery("");
        }} className={` ${showRx ? '' : ' text-white font-bold'}  border-primary px-2 rounded-sm  text-md uppercase`}>Tx Devices</button> <button onClick={() => {
          setShowRx(true)
          setSearchQuery("");
        }} className={` ${!showRx ? '' : ' text-white font-bold'}  border-primary px-2 rounded-sm   text-md uppercase`}>Rx Devices</button></div>
        <div className=' flex-col md:flex-row md:space-x-4 hidden md:flex'>

          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='bg-white px-4 py-1 rounded-sm text-primary w-48'
          />

          <div className='flex space-x-4  pt-2 md:pt-0 text-white  '>
            <PrimaryButton onClick={() => setAddDevicePopUpState(true)}>Add Device</PrimaryButton>
            <PrimaryButton className=' w-84' onClick={() => router.push("/saathi/group")}>Group</PrimaryButton>
            <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
            <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
            <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
          </div>


        </div>
      </div>



      <div className="bg-black mx-4 mb-4 overflow-scroll no-scrollbar px-4 rounded-b-md">
        <HeaderTable columns={SaathiDeviceTableHeaderData} />
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => {
            device.s_no = index+1;
            device.section_name = device.section.sectional_code;
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
          <SaathiDeviceReservationForm onClose={() => setAddDevicePopUpState(false)} />
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <SaathiDeviceUpdateForm isTransmitter={showRx ? false : true} device={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>
    </div>
  );
};

export default DevicePage;
