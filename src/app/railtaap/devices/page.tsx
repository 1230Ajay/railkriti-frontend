import React from 'react'
import DevicePage from './devices_page'
import { Metadata } from 'next';
import { RailTaapMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new RailTaapMetaData().getMetaData().Devices;



function page() {
  return (
    <div><DevicePage/></div>
  )
}

export default page