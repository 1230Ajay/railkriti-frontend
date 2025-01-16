import React from 'react'
import DivisionPage from './division_page'
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Division | Railkriti',
  description: 'All of working division can we manged from this page for railkrti',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


export default function page() {
  return (
    <div><DivisionPage/></div>
  )
}
