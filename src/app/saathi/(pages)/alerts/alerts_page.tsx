'use client';
import React, { useState, useEffect } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import NavBar from '@/components/nav/navbar';
import AddAlert from '@/components/forms/saathi/alert/add';
import UpdateAlert from '@/components/forms/saathi/alert/update';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';

interface Alert {
  uid: string;
  device: {
    name: string;
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
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [showRx, setShowRx] = useState(false); // Switch between Rx and Tx alerts

  // Function to fetch Tx alerts
  const fetchTxAlerts = async () => {
    setLoading(true);
    try {
      const response = await myIntercepter.get(`${conf.SAATHI_TX}/api/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching Tx alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch Rx alerts
  const fetchRxAlerts = async () => {
    setLoading(true);
    try {
      const response = await myIntercepter.get(`${conf.SAATHI_RX}/api/alerts`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching Rx alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between Rx and Tx alerts
  useEffect(() => {
    if (showRx) {
      fetchRxAlerts();
    } else {
      fetchTxAlerts();
    }
  }, [showRx]);

  // Search filtering
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = alerts.filter(
      (alert) =>
        alert.device.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        alert.mobile.toLowerCase().includes(lowerCaseSearchTerm) ||
        (alert.email && alert.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredAlerts(filtered);
  }, [searchTerm, alerts]);

  const activateDeactivateAlert = async (alert: Alert) => {
    try {
      alert.isActive = !alert.isActive;
      const route = showRx ? conf.SAATHI_RX : conf.SAATHI_TX;
      const res = await myIntercepter.put(`${route}/api/alerts/${alert.uid
      }`, alert);
      if (res?.status === 200) {
        setAlerts(prevAlerts =>
          prevAlerts.map(a => (a.uid === alert.uid ? { ...a, isActive: alert.isActive } : a))
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

  return (
    <div className='grid h-[calc(100vh-80px)] grid-rows-[auto_1fr]'>
   
      <div className='flex justify-between items-center px-4 mt-4 rounded-t-md bg-black mx-4'>
        <div className='transition-all space-x-2 py-5 text-gray-400'>
          <button
            onClick={() => setShowRx(false)}
            className={` ${!showRx ? 'text-white font-bold' : ''} border-primary px-2 rounded-sm text-md uppercase`}
          >
            Tx Alerts
          </button>
          <button
            onClick={() => setShowRx(true)}
            className={` ${showRx ? 'text-white font-bold' : ''} border-primary px-2 rounded-sm text-md uppercase`}
          >
            Rx Alerts
          </button>
        </div>
        <div className='space-x-4 items-center hidden lg:flex'>
          <input
            type='text'
            placeholder='Search...'
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
          <div className='grid grid-cols-8 font-semibold capitalize px-4 text-xs md:text-base items-center text-start'>
            <p>Sr. No</p>
            <p>Name</p>
            <p>Designation</p>
            <p className='text-center'>Mobile no</p>
            <p className='col-span-2 text-center'>Email ID</p>
            <p className='text-center'>isActive</p>
            <p className='text-center'>Details</p>
          </div>
        </div>
        <div>
          {loading ? (
            <div className='text-white text-center'>Loading...</div>
          ) : (
            <div className='text-white rounded-md min-w-[780px]'>
              {filteredAlerts.map((alert, index) => (
                <div
                  key={alert.uid}
                  className='px-4 text-start text-xs md:text-base grid grid-cols-8 border-b border-gray-600 items-center py-1'
                >
                  <p className='ml-2'>{index + 1}</p>
                  <p className='capitalize'>{alert.device.name}</p>
                  <p>{alert.designation}</p>
                  <p className='text-center'>{alert.mobile}</p>
                  <p className='col-span-2'>{alert.email ? alert.email : '--:--'}</p>
                  <button className='text-4xl flex justify-center' onClick={() => activateDeactivateAlert(alert)}>
                    {!alert.isActive ? (
                      <CgToggleOn className='text-primary' />
                    ) : (
                      <CgToggleOff className='text-green-400' />
                    )}
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
            <AddAlert onClose={() => setIsModalOpen(false)} showRx={showRx} />
          </div>
        </Modal>
      )}
      {isUpdateModalOpen && selectedAlert && (
        <Modal isOpen={isUpdateModalOpen}>
          <div className='w-[68vw] bg-black px-8 py-4'>
            <UpdateAlert onClose={() => setIsUpdateModalOpen(false)} alertData={selectedAlert} showRx={showRx} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AlertPage;
