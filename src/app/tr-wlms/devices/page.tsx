import React from 'react'
import DevicePage from './devices_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Devices | TR-WLMS',
  description: 'All Off the devices for wlms can be managed using this page',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


function page() {
  return (
    <div><DevicePage/></div>
  )
}

export default page