import React, { useEffect, useState } from 'react';
import { BiMenu, BiSolidFoodMenu, BiSolidMessageEdit } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { FaEdit, FaHome, FaPlaystation, FaSms, FaUserCog } from 'react-icons/fa';

import { GiLevelCrossing } from "react-icons/gi";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { IoNotifications } from 'react-icons/io5';
import { IconButton } from './buttons/primarybutton';
import { MdContactPhone, MdLogout, MdPassword } from 'react-icons/md';
import UpdatePasswordForm from './forms/UpdatePassword';
import Modal from './pop-ups/AddPopUp';

import { useRouter } from 'next/navigation';
import { BsSignIntersectionSideFill } from 'react-icons/bs';
import { SiPrivatedivision } from "react-icons/si";
import { RiTimeZoneFill } from 'react-icons/ri';
import Image from 'next/image';
import UserDetailsForm from './forms/user/updateUserDetails';
import Link from 'next/link';
import myInterceptor from '@/lib/interceptor';
import conf from '@/lib/conf/conf';

type DashboardNavProps = {
  toggleSidebar: () => void;
  sidebarStatus: boolean;
  isHome?: boolean;
  disableMenuBar?: boolean;
  title?: {
    titleSm: string,
    titleXl: string
  }

};

const DashboardNav: React.FC<DashboardNavProps> = (details: DashboardNavProps) => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isContactMessageOpen, setIsContactMessageOpen] = useState<boolean>(false);
  const [user,setUser] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setUserData = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));  // Properly set user state
      }
    };
  
    setUserData();  // Call once on mount
  }, []); // Empty dependency array to ensure it runs only once
  
  
  const isAdmin = ()=>{
  //  console.log(user.role);
   return true;
  }

  const formatDateTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds}; ${day} ${month} ${year}`;
  };
  const handleSignOut = async () => {
    const res = await myInterceptor.post(`${conf.API_GATEWAY}/auth/logout`, {})
    if (res.status === 200) {
      router.push("sign-in");
    }
  };

  const redirect = async (route: string) => {
    router.push(route);
  }

  return (
    <div className="flex items-center justify-between py-4 h-20 px-4 bg-black  w-screen z-10">
      <div className="flex items-center h-full text-4xl space-x-4 font-semibold text-white cursor-pointer">
        {details.disableMenuBar ? <></> : <div>
          {details.isHome ? <></> : <div className="text-5xl" onClick={details.toggleSidebar}>
            {details.sidebarStatus ? <CgClose /> : <BiMenu />}
          </div>}
        </div>
        }

        {details.isHome ? <div>
          <div>
            <Image src="/assets/logo/logo-dark.png" alt="Logo" width={360} height={80} />
          </div>
        </div> : <Link href={'dashboard'} className="flex items-end lg:space-x-2 cursor-pointer">
          <div className="flex items-end">
            <p className="text-2xl lg:hidden">{details.title?.titleSm}</p>
            <p className="hidden capitalize lg:block">{details.title?.titleXl}</p>
          </div>
        </Link>
        }


      </div>

      <div className=" flex space-x-3 lg:space-x-6 text-white h-full items-center capitalize font-semibold pr-8">
        <div className="hidden lg:block">
          <p>{formatDateTime(currentDateTime)}</p>
        </div>



        <div onClick={() => router.push('/application')} className="bg-white cursor-pointer flex p-2 text-primary text-center rounded-full hover:text-white hover:bg-primary transition-all duration-75">
          <FaHome />
        </div>

        {details.isHome && isAdmin() ? <div className="relative ">
          <div
            className={` p-2 hidden lg:flex  text-center rounded-full ${isContactMessageOpen ? 'bg-primary text-white' : 'bg-white text-primary'}`}
            onMouseEnter={() => setIsContactMessageOpen(true)}
            onMouseLeave={() => setIsContactMessageOpen(false)}
          >
            <BiSolidMessageEdit />
          </div>
          {isContactMessageOpen && (
            <div
              className="absolute right-0 -mt-2 pt-4 w-56 rounded-md shadow-lg z-20"
              onMouseEnter={() => setIsContactMessageOpen(true)}
              onMouseLeave={() => setIsContactMessageOpen(false)}
            >
              <ul className="py-1 bg-black border-gray-300 border rounded-md">
                <IconButton icon={FaUsersBetweenLines} name="Users" onClick={() => router.push("/users")} />
                <IconButton icon={MdContactPhone} name="Contact" onClick={() => console.log("Contact details")} />
                <IconButton icon={FaSms} name="Custom" onClick={() => console.log("Custom")} />
              </ul>
            </div>
          )}
        </div> : <></>}

        <div className={`bg-white hidden lg:flex  text-primary cursor-pointer text-center rounded-full ${details.isHome ? '' : 'p-2'}`}>
          {details.isHome ? isAdmin() ? <div className="relative">
            <div
              className={` p-2  text-center rounded-full ${isMenuOpen ? 'bg-primary text-white' : 'bg-white text-primary'}`}
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <BiSolidFoodMenu />
            </div>
            {isMenuOpen && (
              <div
                className="absolute right-0 -mt-2 pt-4 w-56 rounded-md shadow-lg z-20"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <ul className="py-1 bg-black border-gray-300 border rounded-md">

                  <IconButton icon={RiTimeZoneFill} name="Zone" onClick={() => redirect("/zone")} />
                  <IconButton icon={SiPrivatedivision} name="Division" onClick={() => redirect("/division")} />
                  <IconButton icon={BsSignIntersectionSideFill} name="Section" onClick={() => redirect("/section")} />
                  <IconButton icon={FaPlaystation} name="Station" onClick={() => redirect("/station")} />
                  <IconButton icon={GiLevelCrossing} name="LC" onClick={() => redirect("/lc")} />
                </ul>
              </div>
            )}
          </div> : "" : <IoNotifications />}
        </div>

        <div className="relative ">
          <div
            className={` p-2  text-center cursor-pointer rounded-full ${showDropdown ? 'bg-primary text-white' : 'bg-white text-primary'}`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <FaUserCog />
          </div>
          {showDropdown && (
            <div
              className="absolute right-0 -mt-2 pt-4 w-56 rounded-md shadow-lg z-20"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <ul className="py-1 bg-black border-gray-300 border rounded-md">
                <div className="mx-4 pt-2 space-y-4 mb-2 pb-2 border-b border-gray-500">
                  <div>Name: {user?.firstName} {user?.lastName}</div>
                  <div>Mobile: {user?.mobile}</div>
                </div>
                <IconButton icon={MdPassword} name="Change Password" onClick={() => setIsPasswordModalOpen(true)} />
                <IconButton icon={FaEdit} name="Edit Profile" onClick={() => setUserModalOpen(true)} />
                <IconButton icon={MdLogout} name="Log Out" onClick={handleSignOut} />
              </ul>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isUserModalOpen}>
        <div className=' px-8 py-4 bg-black'>
          <UserDetailsForm onCancel={() => setUserModalOpen(false)} username={""} firstName={""} lastName={""} contactNo={""} email={""} designation={""} role={""} />
        </div>
      </Modal>

      <Modal isOpen={isPasswordModalOpen}>
        <UpdatePasswordForm uid={""} onCancel={() => setIsPasswordModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DashboardNav;

