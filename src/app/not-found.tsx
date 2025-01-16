'use client'
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';


const Page = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <h1 className="text-6xl font-bold  text-white">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-200">Page Not Found</p>
      <p className="mt-2 text-gray-300">Sorry, the page you’re looking for doesn’t exist.</p>
      <div  onClick={()=>router.back()} className="mt-6 px-4 py-2 text-white bg-primary font-semibold rounded hover:bg-primary/80">
        Go Back 
      </div>
      <Link href="/application" className="mt-6  text-white  text-sm rounded ">
       Go to Application Page
      </Link>

    </div>
  );
};

export default Page;
