import React from 'react'
import LogDetails from './logs_page'
import { Metadata } from 'next'


export const metadata:Metadata = {
  title: 'LOGS | Vinimay',
  description: 'Default page description for SEO.',
}


function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <LogDetails params={params}/>
    </div>
  )
}

export default page