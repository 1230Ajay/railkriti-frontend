"use client"

import { HeaderTile } from '@/components/headers/header.tile';
import conf from '@/lib/conf/conf';
import myInterceptor from '@/lib/interceptor';
import React from 'react';

interface SOSItem {
  uid: string;
  title: string;
  description: string;
  // Add other properties you expect from the API
}

export default async function SOSPage() {
  try {
    const response = await myInterceptor.get(`${conf.SAATHI_RX}/api/sos`);
    const data: SOSItem[] = response.data;

    return (
      <div className="sos-container bg-black h-[85vh] mt-4 mx-4 rounded-md text-white overflow-auto no-scrollbar ">
        <HeaderTile title='SOS'></HeaderTile>
        {data.map((sos) => (
          <div key={sos.uid} className="bg-slate-700 text-white rounded-md overflow-hidden shadow-lg flex flex-col md:flex-row gap-4 p-4 mt-4 mx-8 no-scrollbar">
            {/* Image Section */}
            <div className="md:w-1/3 w-full max-h-56">
              <img
                src={`https://railkriti.co.in:3006/${sos.uid}/image`}
                alt="SOS"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-start md:w-2/3 w-full">
              <h3 className="text-xl font-semibold mb-2 capitalize">{sos.title}</h3>
              <p className="text-sm md:text-base leading-relaxed">{sos.description}</p>
            </div>
          </div>

        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching SOS data:', error);
    return (
      <div className="error-message">
        <p>Failed to load SOS data. Please try again later.</p>
      </div>
    );
  }
}