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
import conf from '@/conf/conf';
import { useRouter } from 'next/navigation';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';


interface Device {
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
  is_fixed:any,
  installed_at:any;
  isActive: boolean;
  imei?: string;
  latitude?: string;
  longitude?: string;
  start_date?: string;
  end_date?: string;
  rail_level?: string;
  danger_level?: string;
  sensor_level?: string;
  is_single_line?:boolean;
}
const DevicePage: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showRx, setShowRx] = useState(false); // Initialize as a boolean
  const [devices, setDevices] = useState<Device[]>([]);

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

  const filteredDevices = devices.filter(device => device);

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
  


  return (
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <NavBar title={Titles.SaathiTitle} />
      <div className="flex justify-between max-h-16 items-center mx-4 py-4  bg-black rounded-t-md mt-4 px-4 ">
        <div className="  transition-all space-x-2 text-gray-400"><button onClick={() => setShowRx(false)} className={` ${showRx ? '' : ' text-white font-bold'}  border-primary px-2 rounded-sm  text-md uppercase`}>Tx Devices</button> <button onClick={() => setShowRx(true)} className={` ${!showRx ? '' : ' text-white font-bold'}  border-primary px-2 rounded-sm   text-md uppercase`}>Rx Devices</button></div>
        <div className=' flex-col md:flex-row md:space-x-4 hidden md:flex'>

          <input
            type='text'
            placeholder='Search...'
            value={""}
            onChange={(e) => () => { }}
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
        <div className="grid grid-cols-9  text-white font-bold   min-w-[720px] bg-black   text-center border-y-2   text-xs md:text-base capitalize items-center pb-2 py-2">
          <p >Sr. No.</p>
          <p >  Name</p>
          <p >
            installed at
          </p>

          <p >
            Mobile
          </p>

          <p className="lg:ml-8">Section</p>
          <p className="lg:ml-4">Division</p>

          <p className=" text-center">Zone</p>



          <p className=" text-center">restart</p>
          <p className={`  `}>
            Details
          </p>

        </div>
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => (
            <div key={device.uid} className=' text-xs capitalize md:text-base grid grid-cols-9 border-b border-gray-600 items-center py-1 text-center'>
              <p className='uppercase'>{index + 1}</p>
              <p className=' text-start'>{device.name}</p>
              <p>{`${device.is_fixed?"Fixed":"Mobile"} / ${device.installed_at}`}</p>
              <p>{device.mobile_no}</p>
              <p className=' text-center uppercase'>{device.section.sectional_code}</p>
              <p className=' text-center uppercase'>{device.section.division.divisional_code}</p>
              <p className=' text-center uppercase'>{device.section.division.zone.zonal_code}</p>
              <p className='text-4xl flex justify-center'>
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
              </div>
            </div>
          ))}
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
