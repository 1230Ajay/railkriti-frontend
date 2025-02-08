'use client';

import { PrimaryButton } from '@/components/buttons/primarybutton';
import DashboardNav from '@/components/DashboardNav';
import Modal from '@/components/pop-ups/AddPopUp';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import SectionForm from '@/components/forms/Section';
import { TbListDetails } from 'react-icons/tb';
import UpdateSectionForm from '@/components/forms/domain/update/sectionUpdate';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface Section {
  uid: string;
  name: string;
  sectional_code: string;
  division: {
    name: string;
    zone: {
      name: string;
    };
  };
}

const SectionPage:React.FC = ():JSX.Element => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addSectionPopUpState, setAddSectionPopUpState] = useState<boolean>(false);
  const [updateSectionPopUpState, setUpdateSectionPopUpState] = useState<boolean>(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [updateSection, setUpdateSection] = useState<Section | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await myIntercepter.get(`${conf.LOCTION}/api/section`);
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, []);

  const openUpdateForm = (section: Section) => {
    setUpdateSection(section);
    setUpdateSectionPopUpState(true);
  };

  const onClose = () => {
    setAddSectionPopUpState(false);
  };

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />
      <div className='p-4 h-full w-full pt-4'>
        <div className='flex justify-between items-center bg-black rounded-t-md p-4'>
          <h2 className='font-bold text-2xl text-white uppercase'>Section</h2>
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
              <PrimaryButton onClick={() => setAddSectionPopUpState(true)}>
                Add Section
              </PrimaryButton>
              <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
              <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
              <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
            </div>
          </div>
        </div>

        <div className='bg-black px-4'>
          <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
            <div className='grid grid-cols-6 capitalize px-4 text-xs md:text-base items-center font-bold py-2 text-start'>
              <p>Serial no</p>
              <p>Section</p>
              <p>Sectional code</p>
              <p>Division</p>
              <p>Zone</p>
              <p className='text-center'>Details</p>
            </div>
          </div>
        </div>
        <div className='bg-black h-[55vh] md:h-[70vh] overflow-scroll no-scrollbar px-4 rounded-b-md'>
          <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
            {filteredSections.map((section, index) => (
              <div key={section.uid} className='px-4 text-xs capitalize md:text-base grid grid-cols-6 border-b border-gray-600 items-center py-1 text-start'>
                <p>{index + 1}</p>
                <p>{section.name}</p>
                <p className='uppercase'>{section.sectional_code}</p>
                <p>{section.division.name}</p>
                <p>{section.division.zone.name}</p>
                <div className='flex h-full items-center justify-center'>
                  <button
                    onClick={() => openUpdateForm(section)}
                    className='bg-white hover:bg-primary hover:text-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 hover:shadow-none'
                  >
                    <TbListDetails />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal isOpen={addSectionPopUpState}>
          <div className='w-[720px] bg-black overflow-y-scroll no-scrollbar rounded-md p-8'>
            <SectionForm onClose={onClose} />
          </div>
        </Modal>

        <Modal isOpen={updateSectionPopUpState}>
          <div className='w-[720px] bg-black overflow-y-scroll no-scrollbar rounded-md p-8'>
            {updateSection && <UpdateSectionForm data={updateSection} onClose={() => setUpdateSectionPopUpState(false)} />}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default SectionPage;
