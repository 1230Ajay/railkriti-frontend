import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import { WindMSMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new WindMSMetaData().getMetaData().Alert


export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
