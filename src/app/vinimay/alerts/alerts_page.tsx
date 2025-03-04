'use client'
import React, { useState, useEffect } from 'react';
import { TbListDetails } from 'react-icons/tb';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { BsFileEarmarkPdfFill, BsFillPrinterFill } from 'react-icons/bs';
import { CgToggleOff, CgToggleOn } from 'react-icons/cg';
import { PrimaryButton } from '@/components/buttons/primarybutton';
import Modal from '@/components/pop-ups/AddPopUp';
import NavBar from '@/components/nav/navbar';
import TRWLMSAlertForm from '@/components/forms/tr-wlms/alert/trwlmsAlertForm';
import TRWLMSUpdateAlertForm from '@/components/forms/tr-wlms/alert/trwlmsUpdateAlertForm';
import conf from '@/lib/conf/conf';
import myIntercepter from '@/lib/interceptor';
import { Titles } from '@/lib/data/title';


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

const AlertPage: React.FC = ():JSX.Element => {

  return (
    <div className=' grid h-screen grid-rows-[auto_auto_1fr]'>
      <NavBar title={Titles.TrWlmsTitle}></NavBar>


       

    </div>
  );
};

export default AlertPage;
