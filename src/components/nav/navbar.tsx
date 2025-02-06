'use client'
import { useState } from 'react';
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";


interface NavBarProps{
  disableMenuBar?:boolean,
  title?:any
  
}

 const NavBar: React.FC<NavBarProps>  = (details:NavBarProps) =>{
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <main >
      <DashboardNav title={details.title} disableMenuBar={details.disableMenuBar} toggleSidebar={toggleSidebar} sidebarStatus={sidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </main>
  );
}

export default NavBar;