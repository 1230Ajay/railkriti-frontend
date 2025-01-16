import React from 'react'
import AlertPage from './alerts_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Alerts | TR-WLMS',
  description: 'Alerts can be managed from this page for wlms',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


export default function page() {
  return (
    <div><AlertPage/></div>
  )
}
