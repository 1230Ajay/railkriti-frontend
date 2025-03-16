import React from 'react'
import GroupPage from './group_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Groups | Saathi',
  description: 'All Off the devices for wlms can be managed using this page',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


function page() {
  return (
    <div><GroupPage/></div>
  )
}

export default page