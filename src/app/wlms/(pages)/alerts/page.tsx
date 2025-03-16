import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import { BrWlmsMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new BrWlmsMetaData().getMetaData().Alert


export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
