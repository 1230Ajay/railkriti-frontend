'use client';

import DashboardNav from '@/components/DashboardNav';
import ZoneForm from '@/components/forms/Zone';
import Modal from '@/components/pop-ups/AddPopUp';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { ApplicationPageData } from '../../lib/data/ApplicationPageData';
import { FooterData } from '../../lib/data/FooterData';

interface App {
  image: string;
  page: string;
}

interface Section {
  name: string;
  subSections?: SubSection[];
}

interface SubSection {
  name: string;
}


const sections: (Section | string)[] = [
  'Home',
  'Users',
  'Services',
  {
    name: 'Domain',
    subSections: [
      { name: 'zone' },
      { name: 'division' },
      { name: 'section' },
    ],
  },
];

export default function ApplicationPage() {
  const [selectedSection, setSelectedSection] = useState<string>('Home');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isDomainOpen, setIsDomainOpen] = useState<boolean>(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState<boolean>(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);


  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionClick = (section: Section | string) => {
    if (typeof section === 'object' && section.name === 'Domain') {
      setIsDomainOpen(!isDomainOpen);
    } else {
      setSelectedSection(typeof section === 'object' ? section.name : section);
    }
  };

  const handleSubSectionClick = (subSectionName: string) => {
    setSelectedSection(subSectionName);
    if (subSectionName === 'zone') {
      setIsZoneModalOpen(true);
    } else if (subSectionName === 'section') {
      setIsSectionModalOpen(true);
    }
  };

  return (
    <div className="relative lg:h-screen grid lg:grid-rows-[auto_1fr_auto]">
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />

      <div className="lg:absolute h-full -z-10 opacity-20 overflow-clip w-full">
        <Image src={ApplicationPageData.images.bg} alt="Background" fill  style={{ objectFit: 'cover' }} />
      </div>

      <div className="mx-auto mt-8  lg:mt-0  flex items-start md:items-center justify-center  px-8 w-screen">
        <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-8 h-fit w-fit">
          {ApplicationPageData.application.map((app, index) => (
            <div
              key={index}
              onClick={() => {
                const path = `${app.page}`
                const url = `${window.location.origin}${path}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="cursor-pointer  relative rounded-md bg-white/40 p-4 h-48 w-56"
            >
              <Image src={app.image} className="h-full w-full p-1" alt="App" fill style={{ objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black h-fit lg:h-10 z-10 py-2 mt-8  lg:absolute w-screen bottom-0 text-white flex items-center justify-between px-4">
        <Footer />
      </div>

      <Modal isOpen={isZoneModalOpen}>
        <div className="w-96 bg-black  flex items-center justify-center no-scrollbar rounded-md p-8">
          <ZoneForm onClose={() => setIsZoneModalOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

const Footer = () => (
  <div className="flex justify-between flex-col lg:flex-row w-full">
    <div className="gap-2 flex items-center text-sm">
      <p>{FooterData.copyright.year}</p>
      <p className="text-primary hover:text-primary/80 hover:cursor-pointer">
        {FooterData.copyright.company}
      </p>
      <p>{FooterData.copyright.reserve}</p>
    </div>
    <div className="capitalize space-x-2 text-sm  lg:flex">
      {
        FooterData.links.map((link, index) => {
          return <div key={index} className="space-x-2 flex">
            <a className="hover:text-primary" href={link.link}>{link.text}</a>
            <p className=' hidden lg:flex' >|</p>
          </div>
        })
      }
      
    </div>
  </div>
);

