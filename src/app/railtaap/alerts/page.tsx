import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import { RailTaapMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new RailTaapMetaData().getMetaData().Alert


export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
