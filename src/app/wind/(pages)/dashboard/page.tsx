import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import { RailTaapMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new RailTaapMetaData().getMetaData().Dashboard;


function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page