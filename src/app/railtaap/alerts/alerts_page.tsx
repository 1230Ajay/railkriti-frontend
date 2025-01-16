'use client'
import React, { useState, useEffect } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import AlertForm from '@/components/forms/wlms/alert/AlertForm';
import UpdateAlertForm from '@/components/forms/wlms/alert/updateAlertForm';
import NavBar from '@/components/nav/navbar';
import conf from '@/conf/conf';
import myIntercepter from '@/lib/interceptor';

interface Alert {
  uid: string;
  device: {
    km: string;
    location: string;
  };
  designation: string;
  mobile: string;
  email: string;
  first_alert: string;
  second_alert?: string;
  isActive: boolean;
}

const AlertPage: React.FC = (): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [searchTerm, alerts]);

  const fetchAlerts = async () => {
    try {
      const response = await myIntercepter.get(`${conf.RAILTAAP}/api/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = alerts.filter(
      (alert) =>
        alert.device.location.includes(lowerCaseSearchTerm) ||
        alert.mobile.toLowerCase().includes(lowerCaseSearchTerm) ||
        (alert.email && alert.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredAlerts(filtered);
  };

  const activateDeactivateAlert = async (alert: Alert) => {
    try {
      alert.isActive = !alert.isActive;
      const res = await myIntercepter.put(`${conf.RAILTAAP}/api/alerts/${alert.uid}`, alert);
      if (res.status === 200) {
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) => (a.uid === alert.uid ? { ...a, isActive: alert.isActive } : a))
        );
      }
    } catch (error) {
      console.error('Error activating/deactivating alert:', error);
    }
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleUpdateClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsUpdateModalOpen(true);
  };

  const title = [
    { short: 'R', full: 'ail' },
    { short: 'T', full: 'aap' },
  ];

  return (
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <NavBar title={title}></NavBar>

      <div className='flex justify-between items-center px-4 mt-4 rounded-t-md bg-black mx-4'>
        <h2 className='font-bold text-white py-4 uppercase text-2xl'>Alerts</h2>
        <div className='space-x-4 items-center hidden lg:flex'>
          <input
            type='text'
            placeholder='Search by river name, mobile, or email...'
            className='bg-white px-4 py-1 rounded-sm text-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PrimaryButton onClick={() => setIsModalOpen(true)}>Set Alert</PrimaryButton>
          <div className='flex rounded-md space-x-4 w-fit text-white justify-center items-center'>
            <RiFileExcel2Fill className='bg-green-600 h-8 w-8 p-1 rounded-sm' />
            <BsFileEarmarkPdfFill className='bg-red-600 h-8 w-8 p-1 rounded-sm' />
            <BsFillPrinterFill className='bg-blue-600 h-8 w-8 p-1 rounded-sm' />
          </div>
        </div>
      </div>

      <div className='bg-black mx-4 py-2 rounded-b-md mb-4 overflow-scroll no-scrollbar px-4'>
        <div className='border-t-2 border-b-2 min-w-[780px] text-white py-3'>
          <div className='grid grid-cols-10 font-semibold capitalize px-4 text-xs md:text-base items-center text-start'>
            <p>Sr. No</p>
            <p>Bridge no</p>
            <p>River name</p>
            <p>Designation</p>
            <p className='text-center'>Mobile no</p>
            <p className='col-span-2 text-center'>Email ID</p>
            <p>Time</p>
            <p className='text-center'>isActive</p>
            <p className='text-center'>Details</p>
          </div>
        </div>
        <div className=''>
          {loading ? (
            <div className='text-white text-center'>Loading...</div>
          ) : (
            <div className='text-white rounded-md min-w-[780px]'>
              {filteredAlerts.map((alert, index) => (
                <div
                  key={alert.uid}
                  className='px-4 text-start text-xs md:text-base grid grid-cols-10 border-b border-gray-600 items-center py-1'
                >
                  <p className='ml-2 '>{index + 1}</p>
                  <p className='uppercase'>{alert.device.km}</p>
                  <p className='capitalize'>{alert.device.location}</p>
                  <p>{alert.designation}</p>
                  <p className='text-center'>{alert.mobile}</p>
                  <p className='col-span-2'>{alert.email ? alert.email : '--:--'}</p>
                  <p>{`${formatTime(alert.first_alert)}${
                    alert.second_alert ? `, ${formatTime(alert.second_alert)}` : ''
                  }`}</p>
                  <button className='text-4xl flex justify-center' onClick={() => activateDeactivateAlert(alert)}>
                    {!alert.isActive ? <CgToggleOn className='text-primary ' /> : <CgToggleOff className='text-green-400' />}
                  </button>
                  <div className='flex h-full items-center justify-center'>
                    <button
                      onClick={() => handleUpdateClick(alert)}
                      className='bg-white text-primary w-fit px-4 rounded-full shadow-md font-semibold py-1 text-teal-500 hover:shadow-none'
                    >
                      <TbListDetails />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen}>
          <div className='w-[68vw] bg-black px-8 py-4'>
            <AlertForm onClose={() => setIsModalOpen(false)} />
          </div>
        </Modal>
      )}
      {isUpdateModalOpen && selectedAlert && (
        <Modal isOpen={isUpdateModalOpen}>
          <div className='w-[68vw] bg-black px-8 py-4'>
            <UpdateAlertForm onClose={() => setIsUpdateModalOpen(false)} alertData={selectedAlert} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AlertPage;
