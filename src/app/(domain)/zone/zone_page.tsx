'use client';

import { PrimaryButton } from '@/components/buttons/primarybutton';
import DashboardNav from '@/components/DashboardNav';
import UpdateZoneForm from '@/components/forms/domain/update/updateZone';
import ZoneForm from '@/components/forms/Zone';
import Modal from '@/components/pop-ups/AddPopUp';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';

interface Zone {
  uid:string
  name: string;
  zonal_code: string;
}

export default function ZonePage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addZonePopUpState, setAddZonePopUpState] = useState<boolean>(false);
  const [updateZonePopUpState, setUpdateZonePopUpState] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedZoneData, setSelectedZoneData] = useState<Zone | null>(null);
  const [zoneData, setZoneData] = useState<Zone[]>([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchZoneData = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
        const data = await response.data;
        setZoneData(data);
      } catch (error) {
        console.error('Error fetching zone data:', error);
      }
    };

    fetchZoneData();
  }, []);

  const filteredZones = zoneData.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (zone: Zone) => {
    setSelectedZoneData(zone);
    setUpdateZonePopUpState(true);
  };

  return (
    <div>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />
      <div className='p-4 h-full w-full pt-4'>
        <div className='flex justify-between items-center bg-black rounded-t-md p-4'>
          <h2 className='font-bold text-2xl text-white uppercase'>Zone</h2>
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
              <PrimaryButton onClick={() => setAddZonePopUpState(true)}>
                Add Zone
              </PrimaryButton>
              <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>

        <div className='bg-black px-4'>
          <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
            <div className='grid grid-cols-4 capitalize font-bold px-4 text-xs md:text-base items-center py-2 text-start'>
              <p>Sr. no.</p>
              <p>Zone</p>
              <p>Zonal code</p>
              <p className='text-center'>Details</p>
            </div>
          </div>
        </div>
        <div className='bg-black h-[55vh] md:h-[70vh] overflow-scroll no-scrollbar px-4 rounded-b-md'>
          <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
            {filteredZones.map((zone, index) => (
              <div key={zone.zonal_code} className='px-4 capitalize text-xs md:text-base grid grid-cols-4 border-b border-gray-600 items-center py-1 text-start'>
                <p>{index + 1}</p>
                <p>{zone.name}</p>
                <p className='uppercase'>{zone.zonal_code}</p>
                <div className='flex h-full items-center justify-center'>
                  <button
                    onClick={() => openUpdateForm(zone)}
                    className='bg-white hover:bg-primary hover:text-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 hover:shadow-none'
                  >
                    <TbListDetails />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={addZonePopUpState}>
          <div className='w-96 bg-black flex items-center justify-center no-scrollbar rounded-md p-8'>
            <ZoneForm onClose={() => setAddZonePopUpState(false)} />
          </div>
        </Modal>

         <Modal isOpen={updateZonePopUpState}>
          <div className='w-96 bg-black flex items-center justify-center no-scrollbar rounded-md p-8'>
            {selectedZoneData && <UpdateZoneForm data={selectedZoneData} onClose={() => setUpdateZonePopUpState(false)} />}
          </div>
        </Modal> 
      </div>
    </div>
  );
}
