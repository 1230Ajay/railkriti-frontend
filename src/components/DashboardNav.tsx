"use client";

import React, { use, useEffect, useState } from 'react';
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
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';

type DashboardNavProps = {
  toggleSidebar: () => void;
  sidebarStatus: boolean;
  isHome?: boolean;
  disableMenuBar?: boolean;
  title?: {
    titleSm: string;
    titleXl: string;
  };
};

const DashboardNav: React.FC<DashboardNavProps> = (details) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactMessageOpen, setIsContactMessageOpen] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = () => {
    console.log(user);
    return user?.role === "admin";
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/sign-in' });
    router.push("/sign-in");
  };

  const redirect = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex items-center justify-between py-4 h-20 px-4 bg-black w-screen z-10">
      <div className="flex items-center h-full text-4xl space-x-4 font-semibold text-white cursor-pointer">
        {!details.disableMenuBar && !details.isHome && (
          <div className="text-5xl" onClick={details.toggleSidebar}>
            {details.sidebarStatus ? <CgClose /> : <BiMenu />}
          </div>
        )}

        {details.isHome ? (
          <div onClick={() => router.push('/application')}>
            <Image src="/assets/logo/logo-dark.png" alt="Logo" width={360} height={80} />
          </div>
        ) : (
          <Link href="/dashboard" className="flex items-end lg:space-x-2 cursor-pointer">
            <div className="flex items-end">
              <p className="text-2xl lg:hidden">{details.title?.titleSm}</p>
              <p className="hidden capitalize lg:block">{details.title?.titleXl}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex space-x-3 lg:space-x-6 text-white h-full items-center capitalize font-semibold pr-8">
        <div onClick={() => router.push('/application')} className="bg-white cursor-pointer flex p-2 text-primary text-center rounded-full hover:text-white hover:bg-primary transition-all duration-75">
          <FaHome />
        </div>

        {details.isHome && isAdmin() && (
          <div className="relative">
            <div
              className={`p-2 hidden lg:flex text-center rounded-full ${isContactMessageOpen ? 'bg-primary text-white' : 'bg-white text-primary'}`}
              onMouseEnter={() => setIsContactMessageOpen(true)}
              onMouseLeave={() => setIsContactMessageOpen(false)}
            >
              <BiSolidMessageEdit />
            </div>
            {isContactMessageOpen && (
              <div className="absolute right-0 -mt-2 pt-4 w-56 rounded-md shadow-lg z-20"
                   onMouseEnter={() => setIsContactMessageOpen(true)}
                   onMouseLeave={() => setIsContactMessageOpen(false)}
              >
                <ul className="py-1 bg-black border-gray-300 border rounded-md">
                  <IconButton icon={FaUsersBetweenLines} name="Users" onClick={() => router.push("/users")} />
                  <IconButton icon={MdContactPhone} name="Contact" onClick={() => toast.info("Contacts is under maintenance")} />
                  <IconButton icon={FaSms} name="Custom" onClick={() => toast.info("Custom is under maintenance")} />
                </ul>
              </div>
            )}
          </div>
        )}

        <div className={`bg-white hidden lg:flex text-primary cursor-pointer text-center rounded-full ${details.isHome ? '' : 'p-2'}`}>
          {details.isHome ? (
            isAdmin() && (
              <div className="relative">
                <div
                  className={`p-2 text-center rounded-full ${isMenuOpen ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                  onMouseEnter={() => setIsMenuOpen(true)}
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <BiSolidFoodMenu />
                </div>
                {isMenuOpen && (
                  <div className="absolute right-0 -mt-2 pt-4 w-56 rounded-md shadow-lg z-20"
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
              </div>
            )
          ) : (
            <IoNotifications />
          )}
        </div>

        <div className="relative">
          <div
            className={`p-2 text-center cursor-pointer rounded-full ${showDropdown ? 'bg-primary text-white' : 'bg-white text-primary'}`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <FaUserCog />
          </div>
          {showDropdown && (
            <div className="absolute right-0 -mt-2 pt-4  w-72 rounded-md shadow-lg z-20"
                 onMouseEnter={() => setShowDropdown(true)}
                 onMouseLeave={() => setShowDropdown(false)}
            >
              <ul className="py-1 bg-black border-gray-300 border rounded-md">
                <div className="mx-4 pt-2 space-y-4 mb-2 pb-2 border-b  border-gray-500">
                  <div>Name: {user?.name}</div>
                  <div className=' normal-case'>Email: {user?.email}</div>
                </div>
                <IconButton icon={MdPassword} name="Change Password" onClick={() => setIsPasswordModalOpen(true)} />
                <IconButton icon={FaEdit} name="Edit Profile" onClick={() => setUserModalOpen(true)} />
                <IconButton icon={MdLogout} name="Log Out" onClick={handleSignOut} />
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* <Modal isOpen={isUserModalOpen}>
        <div className='px-8 py-4 bg-black'>
          <UserDetailsForm
            onCancel={() => setUserModalOpen(false)}
            username={user?.username || ""}
            firstName={user?.firstName || ""}
            lastName={user?.lastName || ""}
            contactNo={user?.mobile || ""}
            email={user?.email || ""}
            designation={user?.designation || ""}
            role={user?.role?.name || ""}
            zone_uid={user?.zone_uid}
            division_uid={user?.division_uid}
            allotedSections={user?.section_uids}
          />
        </div>
      </Modal> */}

      <Modal isOpen={isPasswordModalOpen}>
        <UpdatePasswordForm uid={user?.uid || ""} onCancel={() => setIsPasswordModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DashboardNav;
