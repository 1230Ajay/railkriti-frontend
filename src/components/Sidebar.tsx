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
  const [pages, setPages] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAdmin(parsedUser?.role?.name=== 'admin');
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await allowedSidebarPages(isAdmin);
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

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [toggleSidebar]);


  return (
    <div className="flex bg-gray-800">
      <div
        ref={sidebarRef}
        className={`fixed top-20 rounded-md z-10 transform transition-transform duration-300 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <ul className="font-semibold w-64 bg-black border border-white rounded-md">
          {pages.map((section, index) => (
            <li key={index}>
              <Link href={section.href} passHref>
                <div className="w-full text-left px-4 py-4 uppercase flex items-center text-white hover:bg-gray-700 cursor-pointer">
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
