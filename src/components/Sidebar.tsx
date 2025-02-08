'use client'

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import allowedSidebarPages from '@/lib/data/SidebarData';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<any[]>([]); // Adjust the type if needed
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await allowedSidebarPages(isAdmin); // Fetch pages based on role
      setPages(pages);
    };

    fetchPages();
  }, [isAdmin]);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.relatedTarget as Node)) {
        toggleSidebar();
      }
    };

    const refCurrent = sidebarRef.current;
    if (refCurrent) {
      refCurrent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div className="flex bg-gray-800">
      <div
        ref={sidebarRef}
        className={`fixed top-20 rounded-md z-10 transform transition-transform duration-300 ${sidebarOpen ? 'block' : 'hidden'
          }`}
        aria-hidden={!sidebarOpen}
      >
        <ul className="font-semibold w-64 bg-black border border-white rounded-md">
          {pages.map((section, index) => (
            <li key={index}>
              <Link href={section.href} passHref>
                <div className={`w-full text-left px-4 py-4 uppercase flex items-center text-white`}>
                  <span className="text-2xl mr-3 text-gray-400">
                    <section.icon />
                  </span>
                  {section.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
