import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import { TrackWlmsMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new TrackWlmsMetaData().getMetaData().Dashboard;

function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page