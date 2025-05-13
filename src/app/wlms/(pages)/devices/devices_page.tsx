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
import DeviceReservationForm from '@/components/forms/wlms/DeviceRegistration';
import DeviceUpdateForm from '@/components/forms/wlms/updateDeviceDetail';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { BrDeviceTableHeaderData } from '@/lib/data/br-wlms/data.device-page-table-header';
import TableRow from '@/components/tiles/tile.table-row';
import { MdChatBubbleOutline } from "react-icons/md";
import ChatPopUp from '@/components/pop-ups/ChatPopUp';

interface Zone {
  uid: string;
  name: string;
  zonal_code: string;
}

interface Division {
  uid: string;
  name: string;
  zone_uid: string;
  divisional_code: string;
  zone: Zone;
}

interface Section {
  uid: string;
  name: string;
  division_uid: string;
  sectional_code: string;
  division: Division;
}

interface Device {
  s_no: any,
  uid: string;
  bridge_no: string;
  imei: string;
  longitude: string;
  lattitude: string;
  section_uid: string;
  mobile_no: string;
  river_name: string;
  rail_level: number;
  danger_level: number;
  sensor_level: number;
  wl_msl: number;
  isActive: boolean;
  current_level: number;
  battery: number;
  reading_interval: number;
  sensor_status: boolean;
  is_online: boolean;
  relay_status: boolean;
  update_log_time: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  section_name: any;
  zone_name: any;
  division_name: any;
  section: Section;
  danger_interval:any;
}

const DevicePage: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [chatPopUpState, setChatPopUpState] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    try {
      const response = await myIntercepter.get(`${conf.BR_WLMS}/api/device`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };



  const filteredDevices = devices.filter(device =>
    device.river_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (device: Device) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };

  const openChatPanel = (device: Device) => {
    setSelectedDevice(device);
    setChatPopUpState(true);
  }

  const activateDeactivate = async (uid: string, status: boolean) => {
    try {
      const response = await myIntercepter.put(`${conf.BR_WLMS}/api/device/${uid}`, {
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
    { name: "Bridge No", key: "bridge_no", className: "text-start" },
    { name: "River", key: "river_name", className: "text-start capitalize" },
    { name: "Mobile", key: "mobile_no", className: "text-start" },
    { name: "interval", key: "reading_interval", className: "text-center" },
    { name: "Section", key: "section_name", className: "uppercase" },
    { name: "Division", key: "division_name", className: "text-center" },
    { name: "Zone", key: "zone_name", className: "text-center" },
  ];


  return (
    <div className=' grid h-[calc(100vh-96px)] grid-rows-[auto_1fr] '>

      <HeaderTile title="BR Devices" onSearchChange={setSearchTerm} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddDevicePopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className="bg-black  mx-4 mb-4   overflow-scroll no-scrollbar px-4 rounded-b-md">

        <HeaderTable columns={BrDeviceTableHeaderData} />
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => {
            device.s_no = index + 1;
            device.section_name = device.section.sectional_code;
            device.division_name = device.section.division.divisional_code;
            device.zone_name = device.section.division.zone.zonal_code;

            return (
              <TableRow data={device} columns={columns} actions={[
                {
                  icon: device.isActive ? (
                    <CgToggleOff className='text-green-400 text-4xl ' />
                  ) : (
                    <CgToggleOn className='text-primary text-4xl' />
                  ),
                  onClick: () => activateDeactivate(device.uid, !device.isActive)
                },

                {
                  icon: <TbListDetails className=' bg-white text-green-500 w-12 rounded-full py-1 text-2xl' />,
                  onClick: () => openUpdateForm(device)
                },

                {
                  icon: <MdChatBubbleOutline className=' bg-white text-green-500 w-12 rounded-full py-1 text-2xl' />,
                  onClick: () => openChatPanel(device)
                }
              ]} />
            )
          })}
        </div>
      </div>

      <Modal isOpen={addDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          <DeviceReservationForm onClose={() => setAddDevicePopUpState(false)} />
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <DeviceUpdateForm device={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>

      <Modal isOpen={chatPopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && (
            <ChatPopUp
              device={selectedDevice}
              onClose={() => setChatPopUpState(false)}
              sendToTopic="device/cmd/brwlms"
              subscribeToTopic="device/scmd/brwlms"
            />
          )}
        </div>
      </Modal>

    </div>
  );
};

export default DevicePage;
