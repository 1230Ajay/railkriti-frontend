import React from 'react'
import Reports from './reports_page'
import { Metadata } from 'next'
import { SaathiMetaData } from '@/lib/data/metaData';




export const metadata: Metadata = new SaathiMetaData().getMetaData().Report;

function page() {
  return (
    <div><Reports/></div>
  )
}

export default page