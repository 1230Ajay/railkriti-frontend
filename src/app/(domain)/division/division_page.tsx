'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';

import { PrimaryButton } from '@/components/buttons/primarybutton';
import DashboardNav from '@/components/DashboardNav';
import Modal from '@/components/pop-ups/AddPopUp';
import DivisionForm from '@/components/forms/Divisoin';
import UpdateDivisionForm from '@/components/forms/domain/update/updateDiv';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface Division {
  uid: string;
  name: string;
  divisional_code: string;
  zone: { name: string };
}

export default function DivisionPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addDivisionPopUpState, setAddDivisionPopUpState] = useState<boolean>(false);
  const [updateDivisionPopUpState, setUpdateDivisionPopUpState] = useState<boolean>(false);
  const [selectedDivision, setSelectedDivision] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [zoneOptions, setZoneOptions] = useState<any[]>([]); // Adjust type based on actual zone data structure

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/division`);
        setDivisions(response.data);
      } catch (error) {
        console.error('Error fetching divisions:', error);
      }
    };

    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/zone`);
        setZoneOptions(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };
    fetchZones();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDivisions = divisions.filter(division =>
    division.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUpdateForm = (division: Division) => {
    setSelectedDivision(division);
    setUpdateDivisionPopUpState(true);
  };

  const onClose = () => {
    setAddDivisionPopUpState(false);
  };

  return (
    <div>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />
      <div className='p-4 h-full w-full pt-4'>
        <div className='flex justify-between items-center bg-black rounded-t-md p-4'>
          <h2 className='font-bold text-2xl text-white uppercase'>Division</h2>
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
              <PrimaryButton onClick={() => setAddDivisionPopUpState(true)}>
                Add Division
              </PrimaryButton>
              <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>

        <div className='bg-black px-4'>
          <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
            <div className='grid grid-cols-5 capitalize px-4 font-bold text-xs md:text-base items-center py-2 text-start'>
              <p>Sr. no.</p>
              <p>Division</p>
              <p>Divisional Code</p>
              <p>Zone</p>
              <p className=' text-center'>Details</p>
            </div>
          </div>
        </div>
        <div className='bg-black h-[55vh] md:h-[70vh] overflow-scroll no-scrollbar px-4 rounded-b-md'>
          <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
            {filteredDivisions.map((division, index) => (
              <div key={division.uid} className='px-5 capitalize text-xs md:text-base grid grid-cols-5 border-b border-gray-600 items-center py-1 text-start'>
                <p>{index + 1}</p>
                <p>{division.name}</p>
                <p className=' uppercase'>{division.divisional_code}</p>
                <p>{division.zone.name}</p>
                <div className='flex h-full items-center justify-center'>
                  <button
                    onClick={() => openUpdateForm(division)}
                    className='bg-white hover:bg-primary hover:text-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 hover:shadow-none'
                  >
                    <TbListDetails />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={addDivisionPopUpState}>
          <div className='flex items-center justify-center w-[480px] bg-black overflow-y-scroll no-scrollbar rounded-md p-8'>
            <DivisionForm onClose={onClose} />
          </div>
        </Modal>

        <Modal isOpen={updateDivisionPopUpState}>
          <div className='flex items-center justify-center w-[480px] bg-black overflow-y-scroll no-scrollbar rounded-md p-8'>
            <UpdateDivisionForm data={selectedDivision} onClose={() => setUpdateDivisionPopUpState(false)} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
