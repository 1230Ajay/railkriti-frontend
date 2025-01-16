import { Metadata } from 'next';
import React from 'react'
import ApplicationPage from './application_page';



export const metadata: Metadata = {
  title: 'Applications | Railkriti',
  description: 'various applications for railkriti',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },

};

function Page() {
  return (
    <div>
      <ApplicationPage/>
    </div>
  )
}

export default Page