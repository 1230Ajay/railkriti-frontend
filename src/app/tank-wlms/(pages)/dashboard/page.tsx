import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import { TankWlmsMetaData} from '@/lib/data/metaData';


export const metadata: Metadata = new TankWlmsMetaData().getMetaData().Dashboard;

function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page