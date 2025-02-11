import React from 'react'
import DevicePage from './devices_page'
import { Metadata } from 'next';
import { BrWlmsMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new BrWlmsMetaData().getMetaData().Devices;


function page() {
  return (
    <div><DevicePage/></div>
  )
}

export default page