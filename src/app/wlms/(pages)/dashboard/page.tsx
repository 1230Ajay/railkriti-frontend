import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import { BrWlmsMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new BrWlmsMetaData().getMetaData().Dashboard

function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page