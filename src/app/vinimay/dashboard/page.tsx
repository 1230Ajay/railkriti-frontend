import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';
import { VinimayMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new VinimayMetaData().getMetaData().Dashboard

function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page