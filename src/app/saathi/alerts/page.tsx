import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import { SaathiMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new SaathiMetaData().getMetaData().Alert;


export default function page() {
  return (
    <div><AlertPage/>
    <div>{}</div>
    </div>
  )
}
