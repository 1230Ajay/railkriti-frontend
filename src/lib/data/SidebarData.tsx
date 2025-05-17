import { MdDashboard, MdOutlineContactPhone } from 'react-icons/md';
import { TbReportSearch, TbDevicesCog } from 'react-icons/tb';
import { HiOutlineBellAlert } from 'react-icons/hi2';
import { getSession } from 'next-auth/react';


const getAllPages = () => {
  return [
    { name: 'Dashboard', href: "dashboard", icon: MdDashboard, role: ['user',"emp", 'admin', 'user-emp'] },
    { name: 'Devices', href: "devices", icon: TbDevicesCog, role: ['admin', "emp",'user-emp'] },
    { name: 'Alerts', href: "alerts", icon: HiOutlineBellAlert, role: ['admin',"emp", 'user', ] },
    { name: 'Reports', href: "reports", icon: TbReportSearch, role: ['admin',"emp",'user-emp',"user"] },
    { name: 'Contact Us', href: "contact", icon: MdOutlineContactPhone, role: ['user', "emp",'admin', 'user-emp'] }
  ];
};

export const allowedSidebarPages = async () => {
  const session = await getSession(); 
  console.log(session);
  const userRole = session?.user?.role || 'user'; 
  const allPages = getAllPages();

  return allPages.filter((page) => {
    if (!page.role) return true;
    return page.role.includes(userRole);
  });
};