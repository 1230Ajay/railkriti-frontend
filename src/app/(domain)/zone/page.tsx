import React from 'react'
import ZonePage from './zone_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Zone | Railkriti',
  description: 'All of working division can we manged from this page for railkrti',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


function page() {
  return (
    <div><ZonePage/></div>
  )
}

export default page