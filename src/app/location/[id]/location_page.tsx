
'use client'
import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import NavBar from '@/components/nav/navbar';


export default function LocationPage(params: any) {
  
    const data = decodeURIComponent(params.params);
   
    const [lat, long, name, postion] = data.split('-');

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const location = { lat: Number(lat), lng: Number(long) }



    return (
        <div className=' capitalize'>
            <NavBar disableMenuBar={true}></NavBar>
            <div className=' font-bold'>
                <LoadScript
                    googleMapsApiKey={process.env.GOOGLE_MAP_KEY || "AIzaSyBIHmUlXSMmL35CWgAjGsdjj1ee72aaJxc"}
                    version="weekly"
                >
                    <GoogleMap

                        mapContainerStyle={{ width: '100%', height: '85vh' }}
                        center={location}
                        zoom={12.5}
                        onLoad={mapInstance => {
                            setMap(mapInstance);
                        }}
                    >
                        <MarkerF label={`${name ?? ''} (${postion})`} position={location}></MarkerF>

                    </GoogleMap>

                </LoadScript>
            </div>
        </div>
    )
}
