'use client';


import UserRegistrationForm from '@/components/forms/user/UserRegistration';
import Image from 'next/image';
import { SignUpPageData } from '@/lib/data/sign-up';


export default function SignUpPage() {





  return (
    <div className='relative lg:items-center lg:justify-center lg:h-screen lg:flex flex-col '>
      <div className="absolute top-0 -z-10 w-full h-full">
        <Image src={SignUpPageData.images.bg} alt="Sign in background" fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="absolute top-8 left-8 sm:w-72 h-8 lg:w-80 lg:h-10">
      <Image src={SignUpPageData.images.logo} alt="Logo" width={360} height={80} />
      </div>


      <div className='mx-3 bg-black pt-20 p-8 rounded-md'>
        <UserRegistrationForm />
      </div>
    </div>
  );
}
