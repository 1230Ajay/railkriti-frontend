'use client'
import React, { useState, useEffect } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';

import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';

import conf from '@/lib/conf/conf';
import AlertForm from '@/components/forms/tank-wlms/alert/AlertForm';
import UpdateAlertForm from '@/components/forms/tank-wlms/alert/updateAlertForm';
import myIntercepter from '@/lib/interceptor';
import { HeaderTile } from '@/components/headers/header.tile';
import HeaderTable from '@/components/headers/header.table';
import TableRow from '@/components/tiles/tile.table-row';
import { TankWLMSAlertTableHeaderData } from '@/lib/data/tn-wlms/data.alert-page.header';

interface Alert {
  s_no:any;
  uid: string;
  device: {
    km: any;
    location: any;
    bridge_no: string;
    river_name: string;
  };
  designation: string;
  mobile: string;
  email: string;
  isActive: boolean;
  km:string;
  location:string;
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
      const response = await myIntercepter.get(`${conf.TANK_WLMS}/api/alerts`);
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
        alert.device.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        alert.mobile.toLowerCase().includes(lowerCaseSearchTerm) ||
        (alert.email && alert.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredAlerts(filtered);
  };

  const activateDeactivateAlert = async (alert: Alert) => {
    try {
      alert.isActive = !alert.isActive;
      const res = await myIntercepter.put(`${conf.TANK_WLMS}/api/alerts/${alert.uid}`, alert);
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

  const columns = [
    { name: "", key: "s_no", className: "text-start" },
    { name: "", key: "km", className: "text-start" },
    { name: "", key: "location", className: "text-start" },
    { name: "", key: "designation", className: "text-start" },
    { name: "", key: "mobile", className: "text-center" },
    { name: "", key: "email", className: "text-start" },
  ];


  return (
    <div className='grid h-screen grid-rows-[auto_auto_1fr]'>
      <HeaderTile title="Alert" onSearchChange={setSearchTerm} actions={[
        { icon: <PrimaryButton >Add</PrimaryButton>, onClick: () => setIsModalOpen(true) },
        { icon: <RiFileExcel2Fill className="bg-green-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export Excel") },
        { icon: <BsFileEarmarkPdfFill className="bg-red-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Export PDF") },
        { icon: <BsFillPrinterFill className="bg-blue-600 h-8 w-8 p-1 rounded-sm" />, onClick: () => console.log("Print") },
      ]} />

      <div className='bg-black mx-4 py-2 rounded-b-md mb-4 overflow-scroll no-scrollbar px-4'>
        <HeaderTable columns={TankWLMSAlertTableHeaderData} />
        <div className=''>
          {loading ? (
            <div className='text-white text-center'>Loading...</div>
          ) : (
            <div className='text-white rounded-md min-w-[780px]'>
              {filteredAlerts.map((alert, index) => {
                alert.s_no = index+1;
                alert.km = alert.device.km;
                alert.location = alert.device.location;
                return (
                  <TableRow data={alert} columns={columns} actions={
                    [
                      { icon: !alert.isActive ? <CgToggleOn className='text-primary text-4xl ' /> : <CgToggleOff className='text-green-400 text-4xl ' />, onClick: () => activateDeactivateAlert(alert) },
                      { icon: <TbListDetails className=' bg-white text-green-500 w-12 rounded-full py-1 text-2xl' />, onClick: () => handleUpdateClick(alert) }
                    ]
                  } />
                )
              })}
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
