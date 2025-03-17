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
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { SectionalTableHeaderData } from '@/lib/data/domain/section-header-data';
import TableRow from '@/components/tiles/tile.table-row';

interface Section {
  s_no:any;
  uid: string;
  name: string;
  sectional_code: string;
  division: {
    name: string;
    divisional_code:string;
    zone: {
      name: string;
      zonal_code:string;
    };
  };
  divisional_code:string;
  zonal_code:string;
}

const columns = [
  {
    name: "",
    key: "s_no",
    className: "text-start"
  },
  {
    name: "",
    key: "name",
    className: "text-start"
  },
  {
    name: "",
    key: "sectional_code",
    className: "text-start"
  },
  {
    name: "",
    key: "divisional_code",
    className: "text-start"
  },
  {
    name: "",
    key: "zonal_code",
    className: "text-start"
  },


]

const SectionPage: React.FC = (): JSX.Element => {
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
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />
      <HeaderTile onSearchChange={setSearchTerm} title={'SECTION'} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddSectionPopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />
      <div className='bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md'>
        <HeaderTable columns={SectionalTableHeaderData} />
          <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
            {filteredSections.map((section, index) => {
              section.s_no = index+1;
              section.divisional_code =  section.division.divisional_code;
              section.zonal_code = section.division.zone.zonal_code;
              return (
                <TableRow data={section} columns={columns} actions={[{
                  icon: <TbListDetails />,
                  onClick: () => openUpdateForm(section),
                  className: 'bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                }]} />
              )
            })}
  
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
  );
}

export default SectionPage;
