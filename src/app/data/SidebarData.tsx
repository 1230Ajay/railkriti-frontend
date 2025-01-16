import { MdDashboard, MdOutlineContactPhone } from 'react-icons/md';
import { TbReportSearch, TbDevicesCog } from 'react-icons/tb';
import { HiOutlineBellAlert } from 'react-icons/hi2';

// Include all pages initially
const getAllPages = () => {
  return [
    { name: 'Dashboard', href: "dashboard", icon: MdDashboard },
    { name: 'Devices', href: "devices", icon: TbDevicesCog },
    { name: 'Alerts', href: "alerts", icon: HiOutlineBellAlert },
    { name: 'Reports', href: "reports", icon: TbReportSearch },
    { name: 'Contact Us', href: "contact", icon: MdOutlineContactPhone }
  ];
};

// Function to filter pages based on the user's role
const allowedSidebarPages = async (isAdmin: boolean) => {
  const pages = getAllPages();

  if (!isAdmin) {
    // Filter out 'Devices' and 'Alerts' if the user is not an admin
    return pages.filter(page => page.name !== 'Devices' && page.name !== 'Alerts');
  }
  
  return pages;
};

export default allowedSidebarPages;
