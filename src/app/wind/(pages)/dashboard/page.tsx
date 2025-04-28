import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import {  WindMSMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new WindMSMetaData().getMetaData().Dashboard;


function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page