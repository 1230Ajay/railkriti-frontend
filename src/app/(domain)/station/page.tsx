'use client'

import { PrimaryButton } from '@/components/buttons/primarybutton';
import DashboardNav from '@/components/DashboardNav';
import DeviceReservationForm from '@/components/forms/wlms/DeviceRegistration';

import Modal from '@/components/pop-ups/AddPopUp';
import React, { useState, ChangeEvent } from 'react';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { RiFileExcel2Fill } from 'react-icons/ri';

interface Device {
  uid: string;
  bridge_number: string;
  river_name: string;
  interval: string;
  mobile_no: string;
  zone: string;
  division: string;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addDevicePopUpState, setAddDevicePopUpState] = useState<boolean>(false);
  const [updateDevicePopUpState, setUpdateDevicePopUpState] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const ZonePageData: Device[] = [{
    uid: '1',
    bridge_number: '123',
    river_name: 'River A',
    interval: '10',
    mobile_no: '9876543210',
    zone: 'Zone 1',
    division: 'Division 1'
  }];

  const filteredDevices = ZonePageData.filter(device =>
    device.bridge_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setUpdateDevicePopUpState(true);
  };

  return (
    <div>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />
      <div className='p-4 h-full w-full pt-24'>
        <div className='flex justify-between items-center bg-black rounded-t-md p-4'>
          <h2 className='font-bold text-2xl text-white uppercase'>Station</h2>
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div>
              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='bg-white px-4 py-1 rounded-sm text-primary w-full'
              />
            </div>
            <div className='flex space-x-4 pt-2 md:pt-0 text-white'>
              <PrimaryButton onClick={() => setAddDevicePopUpState(true)}>
                Add Device
              </PrimaryButton>
              <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>

        <div className='bg-black px-4'>
          <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
            <div className='grid grid-cols-9 capitalize px-4 text-xs md:text-base items-center py-2 text-center'>
              <p>Bridge no</p>
              <p>IFD ID</p>
              <p>River name</p>
              <p>Interval</p>
              <p>Section</p>
              <p>Division</p>
              <p>Zone</p>
              <p>IsActive</p>
              <button>Details</button>
            </div>
          </div>
        </div>
        <div className='bg-black h-[55vh] md:h-[70vh] overflow-scroll no-scrollbar px-4 rounded-b-md'>
          <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
            {filteredDevices.map((device) => (
              <div key={device.uid} className='px-4 text-xs capitalize md:text-base grid grid-cols-9 border-b border-gray-600 items-center py-1 text-center'>
                <p>{device.uid}</p>
                <p>{device.bridge_number}</p>
                <p>{device.river_name}</p>
                <p>{device.interval}</p>
                <p>{device.mobile_no}</p>
                <p>{device.zone}</p>
                <p>{device.division}</p>
                <p className='text-4xl flex justify-center'>{true ? <CgToggleOff className='text-green-400' /> : <CgToggleOn className='text-primary' />}</p>
                <div className='flex h-full items-center justify-center'>
                  <button
                    onClick={() => openUpdateForm(device.uid)}
                    className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={addDevicePopUpState}>
          <div className='h-[70vh] w-[90vw] bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
            <DeviceReservationForm onClose={() => setAddDevicePopUpState(false)} />
          </div>
        </Modal>

        {/* Uncomment the below section to enable device update form */}
        {/* <Modal isOpen={updateDevicePopUpState}>
          <div className='h-[70vh] w-[90vw] bg-black overflow-y-scroll no-scrollbar px-8 pt-4 pb-8 rounded-md lg:pb-0'>
            <DeviceUpdateForm uid={selectedDeviceId} onClose={() => setUpdateDevicePopUpState(false)} />
          </div>
        </Modal> */}
      </div>
    </div>
  );
}
