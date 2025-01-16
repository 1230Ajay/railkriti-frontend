import React from 'react'

import { Metadata } from 'next'
import LogDetails from './logs-page'


export const metadata:Metadata = {
  title: 'LOGS | TANK WLMS',
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