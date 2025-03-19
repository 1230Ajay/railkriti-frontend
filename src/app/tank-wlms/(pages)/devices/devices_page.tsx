'use client'
import React, { useEffect, useState } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import conf from '@/lib/conf/conf';
import TankWLMSDeviceAdd from '@/components/forms/tank-wlms/tankWLMSAdd';
import TankWLMSDeviceUpdate from '@/components/forms/tank-wlms/tankWLMSUpdate';
import myIntercepter from '@/lib/interceptor';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { TankWLMSDeviceTableHeaderData } from '@/lib/data/tn-wlms/data.device-page-table-header';
import TableRow from '@/components/tiles/tile.table-row';

interface Device {
  s_no:any;
  km: any;
  location: any;
  uid: string;
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
  zone_name: string;
  section_name: string;
  division_name: string;
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
      const response = await myIntercepter.get(`${conf.TANK_WLMS}/api/device`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };




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

      const response = await myIntercepter.put(`${conf.TANK_WLMS}/api/device/${uid}`, {
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


  const filteredDevices = devices.filter(device =>
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) || device.km.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const columns = [
    { name: "", key: "s_no", className: "text-start" },
    { name: "", key: "km", className: "text-start" },
    { name: "", key: "location", className: "text-start" },
    { name: "", key: "mobile_no", className: "text-start" },
    { name: "", key: "reading_interval", className: "text-center" },
    { name: "", key: "section_name", className: "text-center" },
    { name: "", key: "division_name", className: "text-center" },
    { name: "", key: "zone_name", className: "text-center" },
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
        <HeaderTable columns={TankWLMSDeviceTableHeaderData} />
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device,index) => {
            device.s_no = index+1;
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
          <TankWLMSDeviceAdd onClose={() => setAddDevicePopUpState(false)}></TankWLMSDeviceAdd>
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <TankWLMSDeviceUpdate device={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>
    </div>
  );
};

export default DevicePage;
