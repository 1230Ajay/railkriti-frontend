import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';
import {  VinimayMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new VinimayMetaData().getMetaData().Alert

export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
