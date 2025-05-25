import React from 'react'

import { Metadata } from 'next'
import LogDetails from './logs-page'
import { WindMSMetaData } from '@/lib/data/metaData';


export const metadata: Metadata = new WindMSMetaData().getMetaData().Log;



function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <LogDetails params={params}/>
    </div>
  )
}

export default page