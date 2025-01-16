import React from 'react'
import SectionPage from './section_page'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Section | Railkriti',
  description: 'All of working sections can we manged from this page for railkrti',
  icons: {
    icon: '/favicon.ico', // Replace with the path to your favicon file
  },
};


export default function page() {
  return (
    <div><SectionPage/></div>
  )
}
