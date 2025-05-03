'use client';

import { PrimaryButton } from '@/components/buttons/primarybutton';
import DashboardNav from '@/components/DashboardNav';
import UpdateZoneForm from '@/components/forms/domain/update/updateZone';
import ZoneForm from '@/components/forms/Zone';
import HeaderTable from '@/components/headers/header.table';
import { HeaderTile } from '@/components/headers/header.tile';
import Modal from '@/components/pop-ups/AddPopUp';
import TableRow from '@/components/tiles/tile.table-row';
import conf from '@/lib/conf/conf';
import { ZoneTableHeaderData } from '@/lib/data/domain/zone-header-data';
import myIntercepter from '@/lib/interceptor';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { TbListDetails } from 'react-icons/tb';

interface Zone {
  uid: string
  name: string;
  zonal_code: string;
  s_no: any;
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
        const response = await myIntercepter.get(`${conf.LOCATION}/api/zone`);
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
      key: "zonal_code",
      className: "text-start"
    },

  ]

  return (
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />

      <HeaderTile onSearchChange={setSearchTerm} title={'ZONE'} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setAddZonePopUpState(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className='bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md'>
        <HeaderTable columns={ZoneTableHeaderData} />
        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredZones.map((zone, index) => {
            zone.s_no = index + 1;
            return (
              <TableRow data={zone} columns={columns} actions={[{
                icon: <TbListDetails />,
                onClick: () => openUpdateForm(zone),
                className: 'bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
              }]} />
            )
          })}
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
  );
}
