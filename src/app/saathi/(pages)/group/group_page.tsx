'use client'
import React, { useEffect, useState } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import NavBar from '@/components/nav/navbar';
import AddGroupForm from '@/components/forms/saathi/group/addGroup';
import UpdateGroupForm from '@/components/forms/saathi/group/updateGroup';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';
import { MdKeyboardBackspace } from 'react-icons/md';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { SaathiGroupTableHeaderData } from '@/lib/data/saathi/data.group-header';
import TableRow from '@/components/tiles/tile.table-row';
import { CgToggleOff } from 'react-icons/cg';

interface Group {
  uid: string;
  name: string;
  s_no: any;
}

const GroupPage: React.FC = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Group | null>(null);

  const [devices, setDevices] = useState<Group[]>([]);

  useEffect(() => {
    getDevice();
  }, []);


  const getDevice = async () => {
    try {
      const response = await myIntercepter.get(`${conf.SAATHI_TX}/api/group`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (device: Group) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };


  const columns = [

    { name: "Bridge No", key: "s_no", className: "text-start" },
    { name: "River", key: "name", className: "text-start uppercase" },
    { name: "Mobile", key: "uid", className: "text-start uppercase" },
  ];


  return (
    <div className=' grid h-[calc(100vh-80px)] grid-rows-[auto_1fr] '>
      <HeaderTile title="Group" onSearchChange={setSearchTerm} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddDevicePopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className="bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md">
        <HeaderTable columns={SaathiGroupTableHeaderData} />

        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device, index) => {
            device.s_no = index + 1;
            return (
              <TableRow data={device} columns={columns} actions={[
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
        <div className='w-fit bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          <AddGroupForm onClose={() => setAddDevicePopUpState(false)} />
        </div>
      </Modal>

      <Modal isOpen={updateDevicePopUpState}>
        <div className='w-fit bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedDevice && <UpdateGroupForm group={selectedDevice} onClose={() => setUpdateDevicePopUpState(false)} />}
        </div>
      </Modal>
    </div>
  );
};

export default GroupPage;
