import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import { TrackWlmsMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new TrackWlmsMetaData().getMetaData().Alert

export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
