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
import TRWLMSDeviceReservationForm from '@/components/forms/tr-wlms/trwlmsDeviceRegistration';
import TRWLMSDeviceUpdateForm from '@/components/forms/tr-wlms/trwlmsupdateDeviceDetail';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import VinimayDeviceUpdateForm from '@/components/forms/vinimay/vinimayUpdateDeviceDetail';
import VinimayDeviceReservationForm from '@/components/forms/vinimay/vinimayDeviceRegistration';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { VinimayDeviceTableHeaderData } from '@/lib/data/vinimay/data.device-page-header';
import TableRow from '@/components/tiles/tile.table-row';


interface Device {
  is_on_track: any;
  location: any;
  uid: string;
  mobile_no: string;
  km: string,
  section: {
    name: string;
    division: {
      name: string;
      divisional_code: string;
      zone: {
        zonal_code: string;
        name: string;
      };
    };
  };
  isActive: boolean;
  imei?: string;
  latitude?: string;
  longitude?: string;
  start_date?: string;
  end_date?: string;
  zone_name: string;
  section_name: string;
  division_name: string;
  s_no: any;
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
      const response = await myIntercepter.get(`${conf.VINIMAY_URL}/api/`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDevices = devices.filter(device =>
    device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (device: Device) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };

  const activateDeactivate = async (uid: string, status: boolean) => {
    try {
      const response = await myIntercepter.put(`${conf.VINIMAY_URL}/api/${uid}`, {
        uid,
        isActive: status
      });

      if (response.status === 200) {
        window.location.reload();
      } else {
        toast.error("Something went wrong while changing device activation status.");
      }
    } catch (error) {
      toast.error("An error occurred while changing device activation status.");
    }
  };


  const columns = [
    { name: 'S. No.', key: "s_no", className: "text-start" },
    { name: "River", key: "location", className: "text-start" },
    { name: "Bridge No", key: "km", className: "text-start" },
    { name: "Mobile", key: "mobile_no", className: "text-start" },
    { name: "Section", key: "section_name", className: "text-center" },
    { name: "Division", key: "division_name", className: "text-center" },
    { name: "Zone", key: "zone_name", className: "text-center" },
  ];


  return (
    <div className=' grid  grid-rows-[auto_1fr] '>

      <HeaderTile title="Vinimay Devices" onSearchChange={setSearchTerm} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddDevicePopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className="bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md">
        <HeaderTable columns={VinimayDeviceTableHeaderData} />
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => {
            device.s_no = index + 1;
            device.section_name = device.section.name;
            device.division_name = device.section.division.divisional_code;
            device.zone_name = device.section.division.zone.zonal_code;
            return (
              <TableRow data={device} columns={columns} actions={[
                {
                  icon: device.isActive ? (
                    <CgToggleOff className='text-green-400 text-3xl' />) : (<CgToggleOn className='text-primary text-3xl' />),
                  onClick: () => activateDeactivate(device.uid, !device.isActive)
                },
                {
                  icon: <TbListDetails />,
                  onClick: () => openUpdateForm(device),
                  className: 'bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                }
              ]} />
            )
          })}
        </div>
      </div>

      <Modal isOpen={addDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          <VinimayDeviceReservationForm onClose={() => setAddDevicePopUpState(false)} />
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <VinimayDeviceUpdateForm device={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>
    </div>
  );
};

export default DevicePage;
