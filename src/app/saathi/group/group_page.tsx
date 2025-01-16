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
import conf from '@/conf/conf';
import title from '../title';
import myIntercepter from '@/lib/interceptor';


interface Group {
  uid: string;
  name: string;

}

const GroupPage: React.FC = ():JSX.Element => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDevices = devices.filter(device =>
    device
  );

  const openUpdateForm = (device: Group) => {
    setSelectedDevice(device);
    setUpdateDevicePopUpState(true);
  };

  const activateDeactivate = async (uid: string, status: boolean) => {
    try {
      const response = await myIntercepter.post(`/api/activate-deactivate-device`, {
        uid,
        status
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



  return (
    <div className=' grid h-screen grid-rows-[auto_auto_1fr] '>
      <NavBar title={title} />

      <div className="flex justify-between max-h-16 items-center mx-4 py-4  bg-black rounded-t-md mt-4 px-4 ">
        <h2 className="font-bold text-white text-xl uppercase">Group</h2>
        <div className=' flex-col md:flex-row md:space-x-4 hidden md:flex'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='bg-white px-4 py-1 rounded-sm text-primary w-full'
          />
          <div className='flex space-x-4 pt-2 md:pt-0 text-white'>
            <PrimaryButton onClick={() => setAddDevicePopUpState(true)}>Add</PrimaryButton>
            <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
            <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
            <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
          </div>
        </div>
      </div>

      <div className="bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md">
        <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
          <div className='grid grid-cols-4 capitalize px-4 text-xs md:text-base items-center py-2 text-center'>
            <p className=' text-start'>Sn. No.</p>
            <p className=' text-start'>Name</p>
            <p className=' text-start'>UID</p>
            <p>Details</p>
          </div>
        </div>

        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredDevices.map((device,index) => (
            <div key={device.uid} className='px-4 text-xs capitalize md:text-base grid grid-cols-4 border-b border-gray-600 items-center py-1 text-center'>
              <p className='uppercase text-start'>{index+1}</p>
              <p className=' text-start'>{device.name}</p>
              <p className=' text-start'>{device.uid}</p>
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
