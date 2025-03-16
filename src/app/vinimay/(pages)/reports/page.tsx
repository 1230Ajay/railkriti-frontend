import React from 'react'
import Reports from './reports_page'
import { Metadata } from 'next'
import {  VinimayMetaData } from '@/lib/data/metaData'



export const metadata: Metadata = new VinimayMetaData().getMetaData().Report;

function page() {
  return (
    <div><Reports/></div>
  )
}

export default page