import { Metadata } from 'next';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import { SignInPageData } from '@/lib/data/sigin-in';


export const metadata: Metadata = {
  title: 'Verified | Railkriti',
  description: 'Default page description for SEO.',

};

export default function verified() {
  return (
    <div className="relative lg:items-center lg:justify-center lg:h-screen lg:flex flex-col ">
    
      
    <div className="absolute top-0 -z-10 w-full  h-full">
        <Image src={`${SignInPageData.images.bg}`} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
      <Image src={`${SignInPageData.images.logo}`} alt="Logo" width={360} height={80} />
      </div>
      <div className="bg-black p-8 rounded-md shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Email Verification Successful</h1>
        <p className="text-gray-300 text-center mb-6">
          Your email has been successfully verified. You can now use all the features of our platform.
        </p>
        <div className="flex justify-center">
          <a
            href="/sign-in"
            className="bg-primary hover:bg-primary text-white font-semibold py-2 px-4 rounded"
          >
            Got to Login
          </a>
        </div>
      </div>
    </div>
  );
}
