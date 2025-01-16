import React from 'react'
import Reports from './reports_page'
import { Metadata } from 'next'



export const metadata:Metadata = {
 title:'Reports | Rail Taap',
 description:"reports for railways devices installed by robokriti india private limited",
 icons: {
  icon: '/favicon.ico', // Replace with the path to your favicon file
},
}

function page() {
  return (
    <div><Reports/></div>
  )
}

export default page