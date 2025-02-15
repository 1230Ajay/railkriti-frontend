'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import DashboardNav from '@/components/DashboardNav';
import Modal from '@/components/pop-ups/AddPopUp';
import { TbListDetails } from 'react-icons/tb';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import UserDetailsForm from '@/components/forms/user/updateUserDetails';
import myIntercepter from '@/lib/interceptor';
import conf from '@/lib/conf/conf';

interface User {
  allotedSections: any;
  zone_uid: any;
  division_uid:any;
  username: string;
  role: {
    uid:string,
    name:string
  };
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  designation: string;
  user_role_id: string;
  isVerified: boolean;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [userUpdateFormState, setUserUpdateFormState] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await myIntercepter.get(`${conf.API_GATEWAY}/auth/users`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchSections();
  }, []);

  const filteredSections = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserStatus = async (user: User, activate: boolean) => {
    try {
      const response = await myIntercepter.post(`${conf.API_GATEWAY}/auth/update`, { identifier: user.username ,isVerified:activate});
      if (response.status === 200) {
        setUsers(prevSections =>
          prevSections.map(u =>
            u.uid === user.uid ? { ...u, isVerified: activate } : u
          )
        );
        toast.success(`${user.firstName} ${user.lastName} has been ${!activate ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error(`Error ${!activate ? 'activating' : 'deactivating'} user:`, error);
    }
  };

  const handleDetailsClick = (user: User) => {
    setSelectedUser(user);
    setUserUpdateFormState(true);
  };

  return (
    <div className=' h-screen grid grid-rows-[auto_auto_1fr] '>
      <DashboardNav toggleSidebar={toggleSidebar} isHome={true} sidebarStatus={sidebarOpen} />

      <div className='flex justify-between items-center bg-black rounded-t-md p-4 mt-4 mx-4'>
        <h2 className='font-bold text-2xl text-white uppercase'>Users</h2>
        <div className=' hidden lg:flex flex-col md:flex-row md:space-x-4'>
          <div>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='bg-white px-4 py-1 rounded-sm text-primary w-full'
            />
          </div>
          <div className='flex space-x-4 pt-2 md:pt-0 text-white'>
            <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
            <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
            <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
          </div>
        </div>
      </div>

      <div className="bg-black  mx-4 mb-4  overflow-scroll no-scrollbar px-4 rounded-b-md">

        <div className='border-t-2 border-b-2 text-white min-w-[720px]'>
          <div className='grid grid-cols-10  text-center capitalize px-4 text-xs md:text-base items-center font-bold py-2 '>
            <p className=' text-start'>Sr. no.</p>
            <p className=' text-start'>username</p>
            <p className=' text-start'>Full Name</p>
            <p className='col-span-2'>Email</p>
            <p>Mobile</p>
            <p>Designation</p>
            <p>Role</p>
            <p className='text-center'>Action</p>
            <p className='text-center'>Details</p>
          </div>
        </div>

        <div className='text-white rounded-md overflow-y-auto min-w-[720px] pb-4'>
          {filteredSections.map((user, index) => (
            <div key={user.uid} className='px-4 text-xs capitalize md:text-base grid grid-cols-10 border-b border-gray-600 items-center py-1 text-center'>
              <p className='  text-start'>{index + 1}</p>
              <p className=' text-start'>{user.username}</p>
              <p className=' text-start'>{user.firstName} {user.lastName}</p>
              <p className='col-span-2 lowercase'>{user.email}</p>
              <p>{user.mobile}</p>
              <p>{user.designation}</p>
              <p className='uppercase'>{user.role.name}</p>
              <div className='flex w-full justify-center'>
                <button
                  onClick={() => updateUserStatus(user, !user.isVerified)}
                  className='text-3xl text-center rounded-md'
                >
                  {!user.isVerified ? <CgToggleOff className='text-green-400' /> : <CgToggleOn className='text-primary' />}
                </button>
              </div>
              <div className='flex h-full items-center justify-center'>
                <button
                  onClick={() => handleDetailsClick(user)}
                  className='bg-white hover:bg-primary hover:text-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 hover:shadow-none'
                >
                  <TbListDetails />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={userUpdateFormState}>
        <div className='bg-black overflow-y-scroll no-scrollbar rounded-md px-8 pt-4 pb-8 lg:pb-0'>
          {selectedUser && (
            <UserDetailsForm
              username={selectedUser.username}
              firstName={selectedUser.firstName}
              lastName={selectedUser.lastName}
              role={selectedUser.role}
              email={selectedUser.email}
              contactNo={selectedUser.mobile}
              zone_uid={selectedUser.zone_uid}
              division_uid={selectedUser.division_uid}
              allotedSections={selectedUser.allotedSections||[]}
              designation={selectedUser.designation}
              onCancel={() => setUserUpdateFormState(false)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
