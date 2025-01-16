import React from 'react'
import Dashboard from './dashboard_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Dashboard | Saathi',
    description: 'Default page description for SEO.',
    icons: {
        icon: '/favicon.ico', // Replace with the path to your favicon file
      },
  };

function page() {
  return (
    <div><Dashboard/></div>
  )
}

export default page