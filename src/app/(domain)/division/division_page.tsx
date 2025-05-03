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
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import { DivisionTableHeaderData } from '@/lib/data/domain/division-header-data';
import TableRow from '@/components/tiles/tile.table-row';

interface Division {
  uid: string;
  name: string;
  divisional_code: string;
  s_no:any;
  zonal_code:string;
  zone: {zonal_code:string,name:string};
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
        const response = await myIntercepter.get(`${conf.LOCATION}/api/division`);
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
        const response = await myIntercepter.get(`${conf.LOCATION}/api/zone`);
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
      key: "divisional_code",
      className: "text-start"
    },
    {
      name: "",
      key: "zonal_code",
      className: "text-start"
    },

  ]


  return (
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />

      <HeaderTile onSearchChange={setSearchTerm} title={'DIVISION'} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddDivisionPopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className='bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md'>

        <HeaderTable columns={DivisionTableHeaderData}/>
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
      
            {filteredDivisions.map((division, index) => {
                division.s_no = index+1;
                division.zonal_code = division.zone ? division.zone.zonal_code : "N/A";
                return (
                <TableRow data={division} columns={columns} actions={[{
                  icon: <TbListDetails />,
                  onClick: () => openUpdateForm(division),
                  className: 'bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                }]} />
              )
            })}
     
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
