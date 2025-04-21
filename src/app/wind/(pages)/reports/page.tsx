import React from 'react'
import Reports from './reports_page'
import { Metadata } from 'next'
import { RailTaapMetaData } from '@/lib/data/metaData'



export const metadata: Metadata = new RailTaapMetaData().getMetaData().Report;


function page() {
  return (
    <div><Reports/></div>
  )
}

export default page